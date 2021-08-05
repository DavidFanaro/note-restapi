import express from "express";
import joi from "joi";
import bcrypt from "bcrypt";
import db from "../database";
import config from "../config";
import passport from "passport";


const controller = express.Router();
const saltRounds = config.saltRounds

controller.get("/", async(req, res) => {
  if(req.user){
    res.send(req.user)
  }else{
    res.send("Not Logged in")
  }
});

controller.post("/new", async (req, res) => {
  const userSchema = joi.object().keys({
    username: joi.string().required().min(8).max(25).alphanum(),
    password: joi.string().required().min(8).alphanum(),
    email: joi.string().email().required(),
  });
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error?.message);
  } else {
    const pwhash = await bcrypt.hash(result.value.password, saltRounds);
    const user = await db.user.create({
      data: {
        username: result.value.username,
        email: result.value.email,
        password: pwhash,
      },
    });
    console.log(user)
    res.send("user created").status(201);
  }
});

export default controller;
