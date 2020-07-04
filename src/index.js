const express = require("express");
const fs = require("fs").promises;
const accountsRoutes = require("./routes/accounts");
const app = express();

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
