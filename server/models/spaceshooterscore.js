"use strict";
module.exports = (sequelize, DataTypes) => {
  const SpaceShooterScore = sequelize.define(
    "SpaceShooterScore",
    {
      name: DataTypes.STRING,
      score: DataTypes.INTEGER
    },
    {
      underscored: true
    }
  );
  SpaceShooterScore.associate = function(models) {
    // associations can be defined here
  };
  return SpaceShooterScore;
};
