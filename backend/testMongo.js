const mongoose = require("mongoose");
console.log("Attempting localhost...");
mongoose.connect("mongodb://localhost:27017/luxerent").then(() => {
  console.log("SUCCESS on localhost!");
  process.exit(0);
}).catch(err => {
  console.error("Localhost error:", err.message);
  console.log("Attempting 127.0.0.1...");
  mongoose.connect("mongodb://127.0.0.1:27017/luxerent").then(() => {
    console.log("SUCCESS on 127.0.0.1!");
    process.exit(0);
  }).catch(err2 => {
    console.error("127.0.0.1 error:", err2.message);
    process.exit(1);
  });
});
