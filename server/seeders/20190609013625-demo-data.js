"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      
      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert(
      "SpaceShooterScores",
      [
        {
          name: "gorilla",
          score: "0"
        },
        {
          name: "clam",
          score: "500"
        },
        {
          name: "octopus",
          score: "200"
        },
        {
          name: "tiger",
          score: "1100"
        },
        {
          name: "monkey",
          score: "200"
        },
        {
          name: "penguin",
          score: "1900"
        },
        {
          name: "dove",
          score: "100"
        },
        {
          name: "dolphin",
          score: "700"
        },
        {
          name: "elk",
          score: "800"
        },
        {
          name: "walrus",
          score: "1100"
        },
        {
          name: "hydra",
          score: "900"
        },
        {
          name: "dog",
          score: "200"
        },
        {
          name: "seal",
          score: "400"
        },
        {
          name: "starling",
          score: "700"
        },
        {
          name: "robin",
          score: "1200"
        },
        {
          name: "cat",
          score: "1300"
        },
        {
          name: "falcon",
          score: "100"
        },
        {
          name: "raptor",
          score: "1500"
        },
        {
          name: "eagle",
          score: "1600"
        },
        {
          name: "horse",
          score: "1300"
        },
        {
          name: "cow",
          score: "800"
        },
        {
          name: "blowfish",
          score: "200"
        },
        {
          name: "rat",
          score: "100"
        },
        {
          name: "snake",
          score: "1200"
        },
        {
          name: "chicken",
          score: "800"
        },
        {
          name: "orca",
          score: "1700"
        },
        {
          name: "salmon",
          score: "100"
        },
        {
          name: "tuna",
          score: "100"
        },
        {
          name: "rooster",
          score: "300"
        },
        {
          name: "whale",
          score: "600"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("SpaceShooterScores", null, {});
  }
};
