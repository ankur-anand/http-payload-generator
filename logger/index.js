const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const logger = createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "userinfo-service" },
  transports: []
});

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        label({ label: "userinfo-service" }),
        format.timestamp(),
        format.colorize(),
        myFormat
      )
    })
  );
}

module.exports = logger;
