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

router.route("/random/auth/username").get(basicAuth, (req, res) => {
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

router.route("/random/username").get(async (req, res) => {
  const payload = {
    "event-id": uuid(),
    "event-time": moment().format(),
    data: {
      user: {
        username: names.generate()
      }
    }
  };
  return res.status(200).json({ data: payload });
});

const funcDelay = function(sec) {
  return new Promise((resolve, reject) => {
    // reslove after one second
    setTimeout(() => {
      resolve();
    }, sec);
  });
};

router.route("/delayedresponse/:duration").get(async (req, res) => {
  const durationDelay = req.params.duration;
  const msOrSec = durationDelay.split("-");
  // No Check of duration is proper of NAN is done.
  let duration = msOrSec[0];
  if (msOrSec[1] === "sec" || msOrSec[1] === "s") {
    duration = msOrSec[0] * 1000;
  }

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
  await funcDelay(duration);
  return res.status(200).json({ data: payload });
});

router.route("/hunderedkb").get(async (req, res) => {
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
  await funcDelay(980);
  return res.status(200).json({ data: payload });
});

router.route("/hunderedkb").post(async (req, res) => {
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
  await funcDelay(980);
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
