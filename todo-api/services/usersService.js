const { reponse_json } = require("../helpers/reponse");
const User = require("../models/user");
const hash = require("../helpers/hash");
const jwt = require("jsonwebtoken");
const { userData } = require("../helpers/user");
const getDevice = require("../helpers/getDevice");
const Token = require("../models/token");

const generateToken = async (data, device = "undefined os") => {
  try {
    const token = await jwt.sign(data, process.env.JWT_SECRET);

    const query = await Token.create(
      {
        user_id: data.id,
        device: device,
        token: token,
      },
      { fields: ["user_id", "device", "token"] }
    );

    if (query) {
      return token;
    }

    return null;
  } catch (error) {
    throw new Error(error);
  }
};

const Register = async (req, res) => {
  try {
    const saveUser = await User.create(
      {
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.email.split("@")[0],
        password: await hash.generateHash(req.body.password),
      },
      { fields: ["fullname", "email", "username", "password"] }
    );

    if (saveUser) {
      return reponse_json({ req, res }, { code: [2003] });
    }
    return reponse_json({ req, res }, { code: [3004], error: [] }, false, 200);
  } catch (error) {
    return reponse_json(
      { req, res },
      { code: [3001], error: error },
      false,
      500
    );
  }
};

const Login = async (req, res) => {
  try {
    let field = process.env.LOGIN_FIELD;

    if (!field) {
      field = "email";
    }

    const identity = req.body.identity;
    const password = req.body.password;

    const device = getDevice(req.headers);

    const user = await User.findOne({
      where: { [field]: identity, active: 1 },
    });

    if (!user) return reponse_json({ req, res }, { code: [3002] }, false);

    const validPass = await hash.bcrypt.compare(password, user.password);

    if (!validPass) return reponse_json({ req, res }, { code: [3002] }, false);

    const token = await generateToken({ id: user.id }, device);

    return reponse_json(
      { req, res },
      { data: userData(user, token) },
      true
    );
  } catch (error) {
    //console.log(error);
    return reponse_json({ req, res }, { code: [3001], error }, false, 500);
  }
};

const getUserByToken = async (req, res) => {
  try {
    if (req.user.token) {
      return reponse_json(
        { req, res },
        { data: userData(req.user, req.user.token) },
        true
      );
    } else {
      return reponse_json({ req, res }, { code: [3002] }, false);
    }
  } catch (error) {
    //console.log(error);
    return reponse_json({ req, res }, { code: [3001], error }, false, 500);
  }
};


module.exports = {
  Register,
  Login,
  getUserByToken,
};
