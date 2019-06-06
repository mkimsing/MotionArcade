"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert(
      "Scores",
      [
        {
          name: "cmorilla0",
          score: "0"
        },
        {
          name: "gheavy1",
          score: "500"
        },
        {
          name: "svittel2",
          score: "31382"
        },
        {
          name: "rfaughnan3",
          score: "34600"
        },
        {
          name: "lcompston4",
          score: "71641"
        },
        {
          name: "mlingard5",
          score: "2900"
        },
        {
          name: "ngremain6",
          score: "9825"
        },
        {
          name: "bsonnenschein7",
          score: "700"
        },
        {
          name: "modonohue8",
          score: "8709"
        },
        {
          name: "kjanic9",
          score: "65168"
        },
        {
          name: "ndecarolisa",
          score: "7"
        },
        {
          name: "gbollisb",
          score: "315"
        },
        {
          name: "murenc",
          score: "59"
        },
        {
          name: "ddoringd",
          score: "8932"
        },
        {
          name: "cgrunwalle",
          score: "482"
        },
        {
          name: "rwesthoferf",
          score: "52260"
        },
        {
          name: "agoudieg",
          score: "76"
        },
        {
          name: "jfursseh",
          score: "5"
        },
        {
          name: "rarundelli",
          score: "8169"
        },
        {
          name: "hmcfaellj",
          score: "3050"
        },
        {
          name: "dvanbrugk",
          score: "60300"
        },
        {
          name: "dcraggl",
          score: "200"
        },
        {
          name: "rdennettm",
          score: "1"
        },
        {
          name: "ecrinionn",
          score: "1200"
        },
        {
          name: "arojahno",
          score: "8450"
        },
        {
          name: "dlaitp",
          score: "85301"
        },
        {
          name: "hdwellyq",
          score: "100"
        },
        {
          name: "rdermottr",
          score: "0"
        },
        {
          name: "gmusslewhites",
          score: "36220"
        },
        {
          name: "spridittt",
          score: "300"
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
  }
};
