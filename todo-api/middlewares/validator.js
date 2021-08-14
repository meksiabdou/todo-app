const Validator = require("../helpers/validate");
const { reponse_json } = require("../helpers/reponse");

const Register = async (req, res, next) => {
  const rules = {
    fullname: "required|string",
    email: "required|email|exist:Users,email",
    password: "required|string|min:8",
    //username: "required|string",
  };

  await Validator(req.body, rules, {}, (errors, status) => {
    if (!status) {
      reponse_json({ req, res }, { code: errors }, false, 200);
    } else {
      next();
    }
  });
};

const Login = async (req, res, next) => {
  const rules = {
    identity: "required|string",
    password: "required|string|min:8",
    //device: "required|string",
  };

  if (process.env.LOGIN_FIELD === "email") {
    rules.identity = "required|email";
  } else if (process.env.LOGIN_FIELD === "phone") {
    rules.identity = "required|phone";
  } else {
    rules.identity = "required|email";
  }

  await Validator(req.body, rules, {}, (errors, status) => {
    if (status) {
      next();
    } else {
      return reponse_json({ req, res }, { code: [3002], errors }, false);
    }
  });
};

const updateUser = (verifyWithPassword) => {
  return async (req, res, next) => {
    const rules = {
      id: "required|string",
      fullname: "required|string",
      email: `required|email`,
      //country: "required|string",
    };

    if (verifyWithPassword) {
      rules.password = "required|string|min:8";
    }

    await Validator(req.body, rules, {}, (errors, status, _errors) => {
      if (!status) {
        reponse_json({ req, res }, { code: errors }, false, 200);
      } else {
        next();
      }
    });
  };
};

const inputValidator = (rules) => {
  return async (req, res, next) => {
    await Validator(req.body, rules, {}, (errors, status, _errors) => {
      if (!status) {
        reponse_json({ req, res }, { code: errors }, false, 200);
      } else {
        next();
      }
    });
  };
};

module.exports = {
  Register,
  Login,
  updateUser,
  inputValidator,
};
