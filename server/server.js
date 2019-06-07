const scoreController = require("./controllers/scoreController");
const express = require("express");
const app = express();

//Ensure routes are defined before listening
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app
  .get("/endlessrunner", (_req, res) => {
    scoreController.getAllScores().then(response => {
      if (!response.error) {
        res.json(response);
      } else {
        res.status(response.error.status).send(response.error.msg);
      }
    });
  })
  .post("/endlessrunner", (req, res) => {
    scoreController.postScore(req.body).then(response => {
      if (!response.error) {
        res.status(201).json(response);
      } else {
        res.status(response.error.status).send(response.error.msg);
      }
    });
  });

app.get("/endlessrunner/:name", (req, res) => {
  scoreController.getScoreForPlayer(req.body).then(response => {
    if (!response.error) {
      res.json(response);
    } else {
      res.status(response.error.status).send(response.error.msg);
    }
  });
});
