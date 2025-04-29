// // visitorTracker.js
// const fs = require("fs");
// const path = require("path");
// const express = require("express");
// const router = express.Router();

// const dataPath = path.join(__dirname, "visitors.json");

// router.get("/track", (req, res) => {
//   const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

//   let data = { totalVisits: 0, visitors: [] };
//   if (fs.existsSync(dataPath)) {
//     data = JSON.parse(fs.readFileSync(dataPath));
//   }

//   if (!data.visitors.includes(ip)) {
//     data.visitors.push(ip);
//   }

//   data.totalVisits++;

//   fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

//   res.json({
//     ip,
//     totalVisits: data.totalVisits,
//     uniqueVisitors: data.visitors.length,
//   });
// });

// module.exports = router;
