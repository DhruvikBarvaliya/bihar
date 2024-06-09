const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const config = require("../config/config");
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: config.LOG_LEVEL,
  format: format.combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(format.colorize(), customFormat),
    })
  );
}

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console({
//     format: format.simple(),
//   }));
// }

module.exports = logger;
