import express, { Router } from "express";
import passport from "passport";

const controller = express.Router();

controller.get("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.send(err);
    }
    if (!user) {
      return res.send({
        msg: "Not Logged in",
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({
        msg: "Logged in",
      });
    });
  })(req, res, next);
});
controller.get("/logout", function (req, res) {
  req.logout();
  res.send({
    msg: "Logged out",
  });
});

export default controller;
