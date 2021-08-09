import express from "express";
import passport from "passport";
import database from "../database";
import { User } from "@prisma/client";
import Joi from "joi";

const controller = express.Router();

// Joi Schemas

const idSchema = Joi.object().keys({
  id: Joi.string().min(1),
});
const textschema = Joi.object().keys({
  text: Joi.string().min(1),
});
const idTextschema = Joi.object().keys({
  id: Joi.string().min(1),
  text: Joi.string().min(1),
});

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
        res
          .send({
            msg: "No Note",
          })
          .status(404);
      }
    } catch (error) {
      res
        .send({
          msg: "No Note",
        })
        .status(404);
    }
  } else {
    res
      .send({
        msg: "Not Logged in",
      })
      .status(403);
  }
});

controller.get("/", async (req, res) => {
  const result = idSchema.validate(req.body);

  if (result.error) {
    res.send(result.error);
  } else {
    if (req.user) {
      try {
        const user = req.user as User;
        const note = await database.note.findFirst({
          where: {
            authorId: user.id,
            id: result.value.id,
          },
        });
        if (note) {
          res.send(note);
        } else {
          res
            .send({
              msg: "No Notes",
            })
            .status(404);
        }
      } catch (e) {
        res
          .send({
            msg: "No Notes",
          })
          .status(404);
      }
    } else {
      res
        .send({
          msg: "Not Logged in",
        })
        .status(403);
    }
  }
});

controller.post("/", async (req, res) => {
  if (req.user) {
    try {
      const user = req.user as User;

      const result = textschema.validate(req.body);
      if (result.error) {
        res.send("error").status(404);
      } else {
        const note = await database.note.create({
          data: {
            text: result.value.text,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        if (note) {
          res.send(note);
        } else {
          res
            .send({
              msg: " No Note",
            })
            .status(404);
        }
      }
    } catch (error) {
      res
        .send({
          msg: "No Note",
        })
        .status(404);
    }
  } else {
    res.send({
      msg: "Not Logged in",
    });
  }
});

controller.put("/", async (req, res) => {
  if (req.user) {
    try {
      const user = req.user as User;

      const result = idTextschema.validate(req.body);

      if (result.error) {
        res.send(result.error.message);
      } else {
        const note = await database.note.update({
          where: {
            id: result.value.id,
          },
          data: {
            text: result.value.text,
          },
        });
        if (note) {
          res.send(note);
        } else {
          res.send("No Note");
        }
      }
    } catch (e) {
      res.send("No Note");
    }
  } else {
    res.send("No User");
  }
});

controller.delete("/", async (req, res) => {
  const result = idSchema.validate(req.body);

  if (req.user) {
    if (result.error) {
      res.send(result.error);
    } else {
      try {
        await database.note.delete({
          where: {
            id: result.value.id,
          },
        });
        res.send("note deteled");
      } catch (error) {
        res.send(error);
      }
    }
  } else {
    res.send("no user");
  }
});

export default controller;
