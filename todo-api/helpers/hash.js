const bcrypt = require("bcrypt");

const generateHash = async (password, salt = 10) => {
  salt = await bcrypt.genSalt(salt);
  return await bcrypt.hash(password, salt);
};

module.exports = {
  generateHash,
  bcrypt,
};
