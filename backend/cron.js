import cron from "cron";
import https from "https";

const URL = "https://medium-ix5b.onrender.com";

// const job = new cron.CronJob("*/14 * * * *", function () {
//   https
//     .get(URL, (res) => {
//       if (res.statusCode === 200) {
//         console.log("GET request sent successfully");
//       } else {
//         console.log("GET request failed", res.statusCode);
//       }
//     })
//     .on("error", (e) => {
//       console.error("Error while sending request", e);
//     });
// });

// const job = new cron.CronJob("*/14 9-22 * * *", function () {
//   https
//     .get(URL, (res) => {
//       if (res.statusCode === 200) {
//         console.log("GET request sent successfully");
//       } else {
//         console.log("GET request failed", res.statusCode);
//       }
//     })
//     .on("error", (e) => {
//       console.error("Error while sending request", e);
//     });
// });

const job = new cron.CronJob({
  cronTime: "*/14 9-22 * * *",
  onTick: function() {
    https.get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    }).on("error", (e) => {
      console.error("Error while sending request", e);
    });
  },
  start: true,
  timeZone: 'Asia/Kolkata'
});

export default job;
