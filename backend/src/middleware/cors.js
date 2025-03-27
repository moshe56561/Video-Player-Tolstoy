const cors = require("cors");

module.exports = cors({
  origin: "*", // Adjust to your frontend URL
  methods: ["GET", "POST"],
});
