const seed = require("./seed");
const testData = require("../seedData/testData/users.js");
const connectionPool = require("../connection");
const devUsers = require("../seedData/devData/devUsers");

const runSeed = () => {
  return seed(devUsers).then(() => {
    connectionPool.close();
  });
};

runSeed();
