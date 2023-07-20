const { Expo } = require("expo-server-sdk");
const { mongoClient } = require("./database");

const expo = new Expo();
const database = mongoClient.db("onev");
const drivers = database.collection("drivers");

const sendNotification = async () => {
  let messages = [];
  const result = drivers.find();
  for await (const doc of result) {
    if (Expo.isExpoPushToken(doc.noti_token) && doc.balance < 4000) {
      messages.push({
        to: doc.noti_token,
        sound: "default",
        body: "Your Balance is Negative. Pay your car dues.",
        data: { withSome: doc.balance },
      });
    }
  }
  let chunks = expo.chunkPushNotifications(messages);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {}
    }
  })();
};

module.exports = { sendNotification };
