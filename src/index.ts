import express from "express";
import morgan from "morgan";
import cor from "cors";
import UserController from "./Controllers/UserController";
import NoteController from "./Controllers/NoteController";
import session from "express-session";
import redis from "redis";
import redismock from "redis-mock";
import RedisStore from "connect-redis";
import AuthController from "./Controllers/AuthController";
import passport from "passport";
const local = require("./Strategies/localStrat");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sessions setup

const store = RedisStore(session);

var redisClient = null;

if (process.env.PROD === "true") {
  redisClient = redis.createClient();
} else {
  redisClient = redismock.createClient();
}

app.use(
  session({
    store: new store({ client: redisClient }),
    saveUninitialized: false,
    secret: process.env.SERCET || "test",
    resave: false,
  })
);

app.use(passport.initialize())
app.use(passport.session())

// app.use(cor("localhost"))

app.get("/", (req, res) => {
  res.send({ Hello: "World" });
});

app.use("/api/user/", UserController);
app.use("/api/auth/", AuthController);
app.use("/api/note/", NoteController);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on localhost:${PORT}`);
});
