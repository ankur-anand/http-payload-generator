const express = require("express");
const router = express.Router();
const names = require("./getnames");

const moment = require("moment");
const uuid = require("uuid/v4");
const rkPayload = require("./return-payload");

const authDB = {
  username: "ankur",
  password: "testpassword"
};

router.route("/auth/username").get(basicAuth, (req, res) => {
  const payload = {
    "event-id": uuid(),
    "event-time": moment().format(),
    data: {
      user: {
        username: names.generate()
      }
    }
  };
  res.status(200).json({ data: payload });
});

const funcDelay = function() {
  return new Promise((resolve, reject) => {
    // reslove after one second
    setTimeout(() => {
      resolve();
    }, 980);
  });
};

router.route("/username").get(async (req, res) => {
  const payload = {
    "event-id": uuid(),
    "event-time": moment().format(),
    data: {
      user: {
        username: names.generate()
      },
      "100kbPayload": rkPayload
    }
  };

  // wait one second
  await funcDelay();
  return res.status(200).json({ data: payload });
});

router.route("/username").post(async (req, res) => {
  const payload = {
    "event-id": uuid(),
    "event-time": moment().format(),
    data: {
      user: {
        username: names.generate()
      },
      "100kbPayload": rkPayload
    }
  };

  // wait one second
  await funcDelay();
  return res.status(200).json({ data: payload });
});

async function basicAuth(req, res, next) {
  // check for basic auth header
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.status(401).json({ message: "Missing Authorization Header" });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");
  const user = (username, password) => {
    if (username === authDB.username && password === authDB.password) {
      return true;
    }
    return false;
  };
  if (!user(username, password)) {
    return res
      .status(401)
      .json({ message: "Invalid Authentication Credentials" });
  }
  // attach user to request object
  req.user = user;
  next();
}

module.exports = router;
