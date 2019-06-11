const scoreController = require("./controllers/scoreController");
const express = require("express");
const app = express();
app.locals.models = require("./models");
const cors = require("cors");
//Ensure routes are defined before listening
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app
  .get("/:gameName", (req, res) => {
    scoreController.getAllScores(req.params.gameName, req).then(response => {
      if (!response.error) {
        res.json(response);
      } else {
        res.status(response.error.status).send(response.error.msg);
      }
    });
  })
  .post("/endlessrunner", (req, res) => {
    if (!req.body || !req.body.name || !req.body.score) {
      res.status(400).send("Please provide a JSON object with name and score");
    } else {
      scoreController.postScore(req.body).then(response => {
        if (!response.error) {
          res.status(201).json(response);
        } else {
          res.status(response.error.status).send(response.error.msg);
        }
      });
    }
  });

//NOTE: Returns an array (but array should only have one item inside)
//TODO change this to return only object?
app.get("/endlessrunner/scores/:name", (req, res) => {
  scoreController.getScoresForPlayer(req.params.name).then(response => {
    if (!response.error) {
      res.json(response);
    } else {
      res.status(response.error.status).send(response.error.msg);
    }
  });
});

app.get("/endlessrunner/topScores", (req, res) => {
  scoreController.getTopRankings(5).then(response => {
    if (!response.error) {
      res.json(response);
    } else {
      res.status(response.error.status).send(response.error.msg);
    }
  });
});

app.get("/endlessrunner/ranks/:name", (req, res) => {
  scoreController.getSurroundingRankings(req.params.name).then(response => {
    if (!response.error) {
      res.json(response);
    } else {
      res.status(response.error.status).send(response.error.msg);
    }
  });
});
