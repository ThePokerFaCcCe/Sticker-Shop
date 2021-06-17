const express = require("express");
const app = express();
_HOME = __dirname;
const dotenv = require("dotenv").config();
if (dotenv.error) throw dotenv.error;

require(`./models/create.js`);
const index = require("./routes/index.js");

const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

app.use(cookieParser());
app.use(expressSession({ secret: process.env.SESSION_SECRET }));

app.use("/content", express.static("./public/images"));
app.use("/content", express.static("./public/javascripts"));
app.use("/content", express.static("./public/stylesheets"));
app.use("/content", express.static("./public/fonts"));
app.use("/content", express.static("./public/icons"));
app.use("/content", express.static("./public/uploaded"));

app.set("view engine", "pug");
app.set("views", "./views");

// /*          ROUTES          */ //
app.use("/", index);

app.listen(3000);
