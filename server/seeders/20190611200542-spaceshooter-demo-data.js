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
      "Scores",
      [
        {
          name: "wyatt",
          score: "0"
        },
        {
          name: "gheavy1",
          score: "500"
        },
        {
          name: "svittel2",
          score: "200"
        },
        {
          name: "rjacobs",
          score: "1100"
        },
        {
          name: "ljones",
          score: "200"
        },
        {
          name: "mlingard",
          score: "1700"
        },
        {
          name: "gremlin",
          score: "100"
        },
        {
          name: "bomb",
          score: "700"
        },
        {
          name: "elk",
          score: "800"
        },
        {
          name: "boats",
          score: "1000"
        },
        {
          name: "nedra",
          score: "900"
        },
        {
          name: "gbol",
          score: "200"
        },
        {
          name: "murenc",
          score: "400"
        },
        {
          name: "ddoring",
          score: "700"
        },
        {
          name: "grunwall",
          score: "1200"
        },
        {
          name: "rwest",
          score: "1300"
        },
        {
          name: "a",
          score: "1700"
        },
        {
          name: "mkimsing",
          score: "1500"
        },
        {
          name: "undelli",
          score: "1600"
        },
        {
          name: "klipsh",
          score: "1300"
        },
        {
          name: "bruh",
          score: "800"
        },
        {
          name: "lmnop",
          score: "200"
        },
        {
          name: "rat",
          score: "100"
        },
        {
          name: "jake",
          score: "1200"
        },
        {
          name: "awoo",
          score: "800"
        },
        {
          name: "lids",
          score: "1700"
        },
        {
          name: "hi",
          score: "100"
        },
        {
          name: "zerg",
          score: "100"
        },
        {
          name: "whites",
          score: "300"
        },
        {
          name: "sprite",
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
    return queryInterface.bulkDelete("Scores", null, {});
  }
};
