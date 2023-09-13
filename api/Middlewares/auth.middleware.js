const Users = require("../Models/users.modell");
const jwt = require("jsonwebtoken");
const sequelize = require("../Models/connection.modell");
const { QueryTypes } = require("sequelize");
exports.isAuth = async (req, res, next) => {
  //res.send({ message: "middleware" });
  //itt kell leellenőrizni, hogy pl az felhasználó be van e lépve, van e érvényes tokenje stb
  //console.log("middleware");
  try {
    //majd nekünk kell ezt beállítani a post kérésnél

    const { authtoken } = req.headers;
    //console.log("middleware");
    //console.log(authtoken);
    //Token meglétének vizsgálata
    if (!authtoken) {
      return res.send({ success: false, out: true, msg: "Hiányzó token!" });
    }
    //Token visszafejtése
    const data = await jwt.verify(authtoken, process.env.ACCESS_TOKEN_KEY);
    //console.log(data);
    if (!data) {
      return res.send({ success: false, out: true, msg: "Hibás token!" });
    }

    //Tiltottsági vizsgálat!

    const denieds = await sequelize.query(
      `SELECT token FROM deniedtokens where token = :authtoken`,
      { replacements: { authtoken: authtoken } },
      QueryTypes.SELECT
    );

    if (denieds[0].length > 0) {
      return res.send({ success: false, out: true, msg: "Token kitiltva!" });
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
        msg: "A felhasználó nem található",
      });
    }
    //console.log(user);
    req.body.user = user;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.send({ success: false, msg: " " + error, logout: true });
    } else {
      return res.send({
        success: false,
        msg: "Fatal Error! middleware " + error,
        logout: true,
      });
    }
  }
  next();
};
