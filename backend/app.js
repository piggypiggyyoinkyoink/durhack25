const express = require("express");
const jwt = require("jsonwebtoken")
const app = express ();
const path = require("path");
const talkJS_API_key = "sk_test_az5PBg3cVYLgky3HvMJ5EHfQAPFILASs";

app.use(express.static("../frontend"));



module.exports=app
