/*
author: Arnob Islam
date: '24-12-21' 
description: ''
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(process.env.MONGODB_DATABASE_URI)
  .then((success) => {
    console.log("Connected successfully....");
  })
  .catch((err) => {
    console.log(err.messege);
    console.log("Fail to connect....");
  });

// use this on client
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

module.exports = app;
