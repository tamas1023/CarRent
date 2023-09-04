const express = require("express");
const app = express();
const cors = require("cors");
const { urlencoded } = require("body-parser");
//const sequelize = require("./Models/connection.modell");

require("dotenv").config();
app.use(cors());
app.use(express.static("Public"));
app.use(urlencoded({ extened: true }));
app.use(express.json());

/*
async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
*/
app.use("/auth", require("./Routes/auth.routes"));
app.use("/home", require("./Routes/home.routes"));

app.get("/alma", async (req, res) => {
  return res.send({ success: true, msg: "alma" });
});

app.listen(process.env.PORT, () => {
  console.log(`A szerver fut a(z) ${process.env.PORT} porton.`);
});
