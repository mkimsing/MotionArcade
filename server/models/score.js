"use strict";
module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define(
    "Score",
    {
      name: DataTypes.STRING,
      score: DataTypes.INTEGER
    },
    {
      underscored: true
    }
  );
  Score.associate = function(models) {
    // associations can be defined here
  };
  return Score;
};
