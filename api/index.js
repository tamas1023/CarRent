const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

app.use(express.json());
app.get("/", (req, res) => {
  //res.send("Üdvözöllek!");
});
app.get("/alma", async (req, res) => {
  return res.send({ success: true, msg: "alma" });
});

app.listen(process.env.PORT, () => {
  console.log(`A szerver fut a ${process.env.PORT}-es porton.`);
});
