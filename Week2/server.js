"use strict";

const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
const consolidate = require("consolidate");
const swig = require("swig");
const MongoClient = require("mongodb").MongoClient;
const http = require("http");
const marked = require("marked");
const helmet = require("helmet");
const logger = require('./logger');  // Use custom Winston logger (no redeclaration!)
const app = express();
const routes = require("./app/routes");
const { port, db, cookieSecret } = require("./config/config");

// ------------------------
// Security headers (Helmet)
// ------------------------
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // Needed if inline scripts are used
    objectSrc: ["'none'"]
  }
}));

// ------------------------
// Express Hardening
// ------------------------
app.disable("x-powered-by");

// ------------------------
// Static Assets & Favicon
// ------------------------
app.use(favicon(__dirname + "/app/assets/favicon.ico"));
app.use(express.static(`${__dirname}/app/assets`));

// ------------------------
// Body Parsers
// ------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ------------------------
// Session Management
// ------------------------
app.use(session({
  secret: cookieSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,        // Set to true in production (with HTTPS)
    httpOnly: true,
    sameSite: 'Strict'
  }
}));

// ------------------------
// Connect to MongoDB
// ------------------------
MongoClient.connect(db, (err, client) => {
  if (err) {
    logger.error("Database connection failed:", err);
    process.exit(1);
  }

  const database = client.db("nodegoat");
  logger.info("Connected to the database");

  // ------------------------
  // Template Engine
  // ------------------------
  app.engine(".html", consolidate.swig);
  app.set("view engine", "html");
  app.set("views", `${__dirname}/app/views`);
  swig.setDefaults({
    autoescape: true // Safer by default
  });

  // ------------------------
  // Markdown Parser
  // ------------------------
  marked.setOptions({
    mangle: false, // Prevents mangling email links
    headerIds: false
  });
  app.locals.marked = marked;

  // ------------------------
  // Load Routes
  // ------------------------
  routes(app, database);

  // ------------------------
  // Start HTTP Server
  // ------------------------
  http.createServer(app).listen(port, () => {
    logger.info(`Express HTTP server listening on port ${port}`);
    console.log(`Express HTTP server listening on port ${port}`);
  });

  /*
  // Optional: HTTPS setup (recommended in production)
  const fs = require("fs");
  const https = require("https");
  const path = require("path");
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/server.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./artifacts/cert/server.crt"))
  };

  https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Express HTTPS server listening on port ${port}`);
  });
  */
});
