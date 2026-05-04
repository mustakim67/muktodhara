// // Example Aggregation for 30-day "RED" count
// const vulnerability = await Sensor.aggregate([
//   { $match: { createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } } },
//   { $group: { _id: "$status", count: { $sum: 1 } } }
// ]);