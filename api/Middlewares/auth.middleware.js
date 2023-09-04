exports.isAuth = async (req, res, next) => {
  //res.send({ message: "middleware" });
  //itt kell leellenőrizni, hogy pl az felhasználó be van e lépve, van e érvényes tokenje stb
  //console.log("middleware");
  next();
};
