const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv/config");
const auth = require("./routes/auth");
const apiAccess = require("./middlewares/apiAccess");
const favicon = require("serve-favicon");
const path = require("path");
const appRouter = require("./routes");

const port = process.env.PORT || 3090;
const hostname = process.env.HOSTNAME || "localhost";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/storages`));
app.use(favicon(path.join(__dirname, "storages", "favicon.ico")));

app.use(apiAccess);
app.use("/app", appRouter);
app.use("/auth", auth);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://${hostname}:${port}`);
});
