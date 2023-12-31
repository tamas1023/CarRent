const Users = require("../Models/users.modell");
const jwt = require("jsonwebtoken");
const sequelize = require("../Models/connection.modell");
const { QueryTypes } = require("sequelize");
exports.isAuth = async (req, res, next) => {
  //itt kell leellenőrizni, hogy pl az felhasználó be van e lépve, van e érvényes tokenje stb
  try {
    //majd nekünk kell ezt beállítani a post kérésnél
    const { authtoken } = req.headers;
    //Token meglétének vizsgálata
    if (!authtoken) {
      return res.send({ success: false, out: true, msg: "Missing token!" });
    }
    //Token visszafejtése
    const data = await jwt.verify(authtoken, process.env.ACCESS_TOKEN_KEY);
    if (!data) {
      return res.send({ success: false, out: true, msg: "Invalid token!" });
    }
    //Tiltottsági vizsgálat!
    const denieds = await sequelize.query(
      `SELECT token FROM deniedtokens where token = :authtoken`,
      { replacements: { authtoken: authtoken } },
      QueryTypes.SELECT
    );

    if (denieds[0].length > 0) {
      return res.send({ success: false, out: true, msg: "Token Banned!" });
    }
    //Felhasználó lekérése
    const user = await Users.findOne({
      where: {
        UserName: data.name,
      },
      attributes: { exclude: ["Password"] },
    });

    if (!user) {
      return res.send({
        success: false,
        out: true,
        msg: "User not found!",
      });
    }
    req.body.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.send({ success: false, msg: " " + error, logout: true });
    } else {
      return res.send({
        success: false,
        msg: "Fatal Error! " + error,
        logout: true,
      });
    }
  }
};
