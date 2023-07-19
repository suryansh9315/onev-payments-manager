const schedule = require("node-schedule");
const { resetDriverBalance } = require('./database')

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = "Asia/Calcutta";

const scheduleJob = () => {
  const job = schedule.scheduleJob(rule, () => {
    console.log("Updating Balance of every driver!");
    resetDriverBalance()
  });
};

module.exports = { schedule, scheduleJob };
