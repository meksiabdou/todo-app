const reponse_json = (ctx, data = [], status = true, code = 200) => {
  if (data.error && !status && parseInt(process.env.ERROR_LOG)) {
    console.log(data.error);
    delete data.error;
  }
  return ctx.res.status(code).json({
    status: status,
    results: data,
  });
};

module.exports = { reponse_json };
