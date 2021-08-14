const Token = require("../models/token");
const User = require("../models/user");
const { userData } = require("../helpers/user");
const { reponse_json } = require("../helpers/reponse");
//const { time } = require("../helpers/time");
const appToken = process.env.APP_TOKEN;
const getDevice = require("../helpers/getDevice");
const jwt = require("jsonwebtoken");


const routes = [
  "/auth/login",
  "/auth/register",
];

//const reg = new RegExp(/\/app\/[a-z-_]+/i);

const apiAccess = async (req, res, next) => {
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
  const message = { method: req.method, url: decodeURIComponent(req.url), ip };
  const path = req.path;

  try {
    const token = decodeURIComponent(req.headers["token"]);
    let statusToken = false;
    const publicPath = routes.includes(path);

    const device = getDevice(req.headers);
    message.device = device;

    if (publicPath) {
      statusToken = [appToken].includes(token);
      if (statusToken) {
        //return next();
      }
    } else {
      const verified = await jwt.verify(token, process.env.JWT_SECRET);

      const queryWhere = {
        token: token,
        device: device,
      };

      const query = await Token.findOne({where : queryWhere})

      const decodeToken = await jwt.decode(token);

      const user = await User.findOne({where : {
        id: decodeToken.id,
        active: 1,
      }});

      if (query && verified && user) {
        statusToken = true;
        req.user = userData(user, token);
      }
    }

    message.authorized = statusToken;
    if (parseInt(process.env.REQUESTS_LOG)) logger.log("info", message);

    if (statusToken) {
      return next();
    }

    return reponse_json({ req, res }, { token: "Invalid Token" }, false, 403);
  } catch (error) {
    message.authorized = false;
    return reponse_json(
      { req, res },
      {
        token: "Invalid Token",
        error: JSON.stringify({ error: error.toString(), ...message }),
      },
      false,
      500
    );
  }
};

module.exports = apiAccess;
