#!/usr/bin/env node
const { dir } = require("console");
const fs = require("fs");
const path = require("path");

const type = process.argv[2];
const name = process.argv[3];
const directory = process.argv[4] || ".";
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta chart="utf-8" />
    <title>Template</title>
</head>
<body>
    <h1>Hello</h1>
    <p>CLI</p>
</body>
</html>
`;

const routerTemplate = `
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
`;

const exist = (dir) => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    );
    return true;
  } catch (e) {
    return false;
  }
};

const mkdirp = (dir) => {
  const dirname = path
    .relative(".", path.normalize(dir))
    .split(path.sep)
    .filter((p) => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeTemplate = () => {
  mkdirp(directory);
  if (type === "html") {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error("This file already exists");
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(pathToFile, "created successfully");
    }
  } else if (type === "express-router") {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error("This file already exists");
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, "created successfully");
    }
  } else {
    console.error("html or express-router");
  }
};

const program = () => {
  if (!type || !name) {
    console.error("Please enter type and name");
  } else {
    makeTemplate();
  }
};

program();
