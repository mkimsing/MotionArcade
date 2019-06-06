const express = require("express");
const app = express();
app.use(express.json());

const { score } = require("./models");

app
  .get("/endlessrunner", (req, res) => {
    //Stuff here
  })
  .post("/endlessrunner", (req, res) => {
    //Stuff here
  });

app.get("/endlessrunner/:name", (req, res) => {
  //Stuff here
});

app.get("/endlessrunner/:name/best", (req, res) => {
  //stuff here
});
