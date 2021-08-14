const useragent = require("express-useragent");

const getDevice = (headers) => {
  try {
    const agent = useragent.parse(headers["user-agent"]);

    return `${agent.browser}_${agent.version}-${agent.platform}`;
  } catch (error) {
    throw new Error(error);
    //return undefined;
  }
};

module.exports = getDevice;
