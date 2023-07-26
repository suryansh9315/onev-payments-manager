const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();

const url = process.env.MONGO_URI;
const mongoClient = new MongoClient(url);
const database = mongoClient.db("onev");
const drivers = database.collection("drivers");

const connectDb = async () => {
  try {
    await mongoClient.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
  }
};

const resetDriverBalance = async () => {
  const filter = { "status": "active" };
  const updatePipeline = [
    {
      $set: {
        balance: { $subtract: ["$balance", "$rent"] }
      },
    },
  ];
  const result = await drivers.updateMany(filter, updatePipeline);
  console.log(`Updated ${result.modifiedCount} documents`);
};

module.exports = { connectDb, mongoClient, resetDriverBalance };
