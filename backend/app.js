const express = require("express");
const jwt = require("jsonwebtoken")
const app = express ();
const path = require("path");

app.use(express.static("../frontend"));



module.exports=app
