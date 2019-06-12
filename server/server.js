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
    let table = scoreController.detectTable(req.params.gameName, req)
    if (table.status) {
      res.status(table.status).send(table.msg)
    }
    else {
      scoreController.getAllScores(table).then(response => {
        if (!response.error) {
          res.json(response);
        } else {
          res.status(response.error.status).send(response.error.msg);
        }
      });
    }
  })
  .post("/:gameName", (req, res) => {
    if (!req.body || !req.body.name || !req.body.score) {
      res.status(400).send("Please provide a JSON object with name and score");
    }
    else {
      let table = scoreController.detectTable(req.params.gameName, req)
      if (table.status) {
        res.status(table.status).send(table.msg)
      }
      else {
        scoreController.postScore(req.body, table).then(response => {
          if (!response.error) {
            res.status(201).json(response);
          } else {
            res.status(response.error.status).send(response.error.msg);
          }
        });
      }
    }
  });

//NOTE: Returns an array (but array should only have one item inside)
//TODO change this to return only object?
app.get("/:gameName/scores/:name", (req, res) => {
  let table = scoreController.detectTable(req.params.gameName, req)
  if (table.status) {
    res.status(table.status).send(table.msg)
  }
  else {
    scoreController.getScoresForPlayer(req.params.name, table).then(response => {
      if (!response.error) {
        res.json(response);
      } else {
        res.status(response.error.status).send(response.error.msg);
      }
    });
  }
});

app.get("/:gameName/topScores", (req, res) => {
  let table = scoreController.detectTable(req.params.gameName, req)
  if (table.status) {
    res.status(table.status).send(table.msg)
  }
  else {
    scoreController.getTopRankings(5, table).then(response => {
      if (!response.error) {
        res.json(response);
      } else {
        res.status(response.error.status).send(response.error.msg);
      }
    });
  }
});

app.get("/:gameName/ranks/:name", (req, res) => {
  let table = scoreController.detectTable(req.params.gameName, req)
  if (table.status) {
    res.status(table.status).send(table.msg)
  }
  else {
    scoreController.getSurroundingRankings(req.params.name, table).then(response => {
      if (!response.error) {
        res.json(response);
      } else {
        res.status(response.error.status).send(response.error.msg);
      }
    });
  }
});
