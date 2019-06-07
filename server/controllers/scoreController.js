// const Sequelize = require("sequelize");
const { Score } = require("../models");
const scoreController = {
  getAllScores: () => {
    return Score.findAll()
      .then(scores => {
        return scores;
      })
      .catch(err => {
        return {
          error: {
            status: 500,
            msg: err
          }
        };
      });
  },
  postScore: scoreObj => {
    if (!scoreObj || !scoreObj.name || !scoreObj.score) {
      return {
        error: {
          status: 400,
          msg: "Please provide a JSON object with name and score"
        }
      };
    }
    return Score.findOrCreate({ where: scoreObj })
      .then(([entry, created]) => {
        if (created) {
          return entry;
        } else {
          //Update the entry
        }
      })
      .catch(err => {
        return {
          error: {
            status: 400,
            msg:
              "There was an error creating that object... Please try again later"
          }
        };
      });
  },
  getScoreForPlayer: name => {
    return Score.findAll({ where: { name: name } })
      .then(scores => {
        return scores;
      })
      .catch(err => {
        return {
          error: {
            status: 500,
            msg: err
          }
        };
      });
  }
};

module.exports = scoreController;
