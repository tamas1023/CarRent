const Users = require("../Models/users.modell");
const jwt = require("jsonwebtoken");
exports.isAuth = async (req, res, next) => {
  //res.send({ message: "middleware" });
  //itt kell leellenőrizni, hogy pl az felhasználó be van e lépve, van e érvényes tokenje stb
  //console.log("middleware");
  try {
    //majd nekünk kell ezt beállítani a post kérésnél
    const { authtoken } = req.headers;

    //Token meglétének vizsgálata
    if (!authtoken) {
      return res.send({ success: false, out: true, msg: "Hiányzó token!" });
    }
    //Token visszafejtése
    const data = await jwt.verify(authtoken, process.env.ACCESS_TOKEN_KEY);
    console.log(data);
    if (!data) {
      return res.send({ success: false, out: true, msg: "Hibás token!" });
    }

    //Tiltottsági vizsgálat!
    /*
    const denideds = await sequelize.query(
      `SELECT token FROM denidedtokens where token = :authtoken`,
      { replacements: { authtoken: authtoken } },
      QueryTypes.SELECT
    );

    if (denideds[0].length > 0) {
      return res.send({ success: false, out: true, msg: "Token kitiltva!" });
    }
    */
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
    if (error === "TokenExpiredError") {
      return res.send({ success: false, msg: " " + error });
    }
    return res.send({ success: false, msg: "Fatal Error! " + error });
  }
  next();
};
