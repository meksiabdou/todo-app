const Validator = require("validatorjs");
const DB = require("../models");

const handleErrors = ({ errors }) => {
  try {
    return Object.keys(errors).map((key) => {
      if (key === "email") return 3006;
      if (key === "phone") return 3007;
      if (key === "password") return 3009;
      if (typeof errors[key] === "object" && errors[key].includes("required"))
        return 3008;
      return 3002;
    });
  } catch (err) {
    return 3002;
    //return err;
  }
};

Validator.registerAsync(
  "exist",
  async function (value, attribute, req, passes) {
    try {
      if (!attribute) {
        throw new Error(
          "Specify Requirements i.e fieldName: exist:collection,field"
        );
      }
      const attArr = attribute.split(",");

      if (attArr.length !== 2) {
        throw new Error(`Invalid format for validation rule on ${attribute}`);
      }

      const { 0: collection, 1: field } = attArr;
      const msg = `existing_${field}`;

      const result = await DB[collection.toLocaleLowerCase()].findOne({
        where: { [field]: value },
      });
      
      if (result) {
        return passes(false, msg);
      }

      return passes();
      
    } catch (error) {
      throw new Error(error);
    }
  }
);

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, {
    required: "required",
    string: "expected_string",
    integer: "expected_integer",
    ...customMessages,
  });
  validation.passes(() => callback(null, true));
  validation.fails(() =>
    callback(handleErrors(validation.errors), false, validation.errors)
  );
};

module.exports = validator;
