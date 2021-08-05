import express, { Router } from "express";
import passport from "passport";

const controller = express.Router()

controller.get('/login',passport.authenticate('local',{
    successRedirect: 'success',
    failureRedirect: 'failed'
}))

controller.get('/failed',(req,res)=>{
    res.send("failed")
})
controller.get('/success',(req,res)=>{
    res.redirect('/api/user')
})



export default controller