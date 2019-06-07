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
    return Score.findOrCreate({
      where: { name: scoreObj.name },
      defaults: scoreObj
    })
      .then(([entry, created]) => {
        if (created) {
          return entry;
        } else {
          //Update the entry
          entry.update({ score: scoreObj.score }).then(() => { });
          return entry;
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
  getScoresForPlayer: name => {
    return Score.findAll({ where: { name: name } })
      .then(scores => {
        if (scores.length === 0) {
          return {
            error: {
              status: 404,
              msg: `No entry with name ${name} found`
            }
          };
        }
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
