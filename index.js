const express = require("express");
const fs = require("fs").promises;
const accountsRoutes = require("./routes/accounts");
const app = express();

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label} ${level} ${message}]`;
});

const logger = createLogger({
  level: "silly",
  transports: [
    new transports.Console(),
    new transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

app.use(express.json());
app.use(accountsRoutes);

app.listen(3000, async () => {
  try {
    await fs.readFile("accounts.json", "utf8");
    logger.info("API Started on Port 3000");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    fs.writeFile("accounts.json", JSON.stringify(initialJson, null, 2)).catch(
      (err) => {
        logger.error(err);
      }
    );
  }
});

module.exports = logger;
