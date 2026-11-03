const express=require("express")
const { signup, login, logout } = require("../controler/userauth")
const authroute=express.Router()

authroute.post('/signup',signup)
authroute.post('/login',login)
authroute.get('/logout', logout);

module.exports=authroute