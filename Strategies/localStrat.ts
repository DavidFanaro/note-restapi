import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import database from "../database";



passport.serializeUser((user:any, done) => {
  done(null, user.id);
});

passport.deserializeUser( async (id:string, done) => {
  try {
    const user = await database.user.findFirst({
      where:{
        id
      }
    })

    done(null,user)
  } catch (error) {
    done(error,false)
  }
});

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await database.user.findFirst({
        where: {
          username,
        },
      });
      if (user) {
        if (bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong Password" });
        }
      } else {
        return done(null, false, { message: "Incorrect username." });
      }
    } catch (e) {
      return done(e,false,{message:"Error"});
    }
  })
);
