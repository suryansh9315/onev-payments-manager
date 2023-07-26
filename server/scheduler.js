const schedule = require("node-schedule");
const { resetDriverBalance } = require('./database')
const { sendNotification } = require('./notifications')

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = "Asia/Calcutta";

const noti_rule = new schedule.RecurrenceRule();
noti_rule.hour = 12;
noti_rule.minute = 0;
noti_rule.tz = "Asia/Calcutta";

const noti_rule_2 = new schedule.RecurrenceRule();
noti_rule_2.hour = 17;
noti_rule_2.minute = 29;
noti_rule_2.tz = "Asia/Calcutta";

const scheduleJob = () => {
  const job = schedule.scheduleJob(rule, () => {
    console.log("Updating Balance of every driver!");
    resetDriverBalance()
  });
}; 

const scheduleNotiJob = () => {
  const job = schedule.scheduleJob(noti_rule, () => {
    console.log("Notifications Job Morning!");
    sendNotification()
  });
  const job_2 = schedule.scheduleJob(noti_rule_2, () => {
    console.log("Notifications Job Evening!");
    sendNotification()
  });
};

module.exports = { schedule, scheduleJob, scheduleNotiJob };
