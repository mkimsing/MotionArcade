const Sequelize = require("sequelize");
// const { Score, SpaceShooterScore } = require("../models");
const scoreController = {
  detectTable: (tableName, req) => {
    let table;
    switch (tableName) {
      case "endlessRunner":
        table = req.app.locals.models.Score;
        break;
      case "spaceShooter":
        table = req.app.locals.models.SpaceShooterScore;
        break;
      default:
        table = {
          status: 404,
          msg: `Could not find table corresponding to: ${tableName}`
        }
        break;
    }
    return table;
  },
  getAllScores: (table) => {
    return table
      .findAll()
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
  postScore: (scoreObj, table) => {
    scoreObj.name = scoreObj.name.toLowerCase();
    return table.findOrCreate({
      where: { name: scoreObj.name },
      defaults: scoreObj
    })
      .then(([entry, created]) => {
        if (created) {
          entry.setDataValue("highScore", false);
          entry.setDataValue("created", true);
          return entry;
        } else {
          if (entry.score < scoreObj.score) {
            return entry.update({ score: scoreObj.score }).then(() => {
              return entry.reload().then(() => {
                //Update the entry
                entry.setDataValue("highScore", true);
                return entry;
              });
            });
          } else {
            entry.setDataValue("highScore", false);
            return entry;
          }
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
  getScoresForPlayer: (name, table) => {
    name = name.toLowerCase();
    return table.findAll({ where: { name: name } })
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
  },
  getTopRankings: (num, table) => {
    return table.sequelize
      .query(
        `SELECT id, name, score, RANK() OVER (ORDER BY score DESC) Ranking from ${table.name + 's'}`,
        { type: table.sequelize.QueryTypes.SELECT }
      )
      .then(results => {
        return results.slice(0, num);
      });
  },
  //Get the +(N-1), -(N-1) rankings around a player's score
  // N = 3
  //Returns 2(N-1) + 1 entries
  //eg. if N = 3, Returns 5 rankings, where name matches, 2 above and 2 below
  getSurroundingRankings: (name, table) => {
    name = name.toLowerCase();
    return table.sequelize
      .query(
        `SELECT id, name, score, RANK() OVER (ORDER BY score DESC) ranking from ${table.name + 's'}`,
        { type: table.sequelize.QueryTypes.SELECT }
      )
      .then(scores => {
        let foundIndex = scores.findIndex(row => {
          return row.name === name;
        });
        if (foundIndex === -1) {
          return {
            error: {
              status: 404,
              msg: `No entry with name ${name} found`
            }
          };
        }
        let num = 3;
        let startIndex = 0;
        if (foundIndex - num >= 0) {
          startIndex = foundIndex - num + 1;
        } else {
          num = 5 - foundIndex;
        }
        return scores.slice(startIndex, foundIndex + num);
      });
  }
};

module.exports = scoreController;
