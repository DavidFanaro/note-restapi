import express from "express";
import passport from "passport";
import database from "../database";
import { User } from "@prisma/client";
import Joi from "joi";

const controller = express.Router();

controller.get("/", async (req, res) => {
  if (req.user) {
    try {
      const user = req.user as User;
      const notes = await database.note.findMany({
        where: {
          authorId: user.id,
        },
      });
      if (notes) {
        res.send(notes);
      } else {
        res.send("No Note");
      }
    } catch (error) {
      res.send("No Notes");
    }
  } else {
    res.send("No User");
  }
});

controller.get("/:id", async (req, res) => {
  if (req.user) {
    try {
      const user = req.user as User;
      const note = await database.note.findFirst({
        where: {
          authorId: user.id,
          id: req.params.id,
        },
      });
      if (note) {
        res.send(note);
      } else {
        res.send("No Note");
      }
    } catch (e) {
      res.send("No Note");
    }
  } else {
    res.send("No User");
  }
});

controller.post('/', (req,res)=> {
    const schema = Joi.object().keys({
        text:Joi.string().empty()
    })

    if(req.user){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }else{
        res.send("No User")
    }
})


export default controller;
