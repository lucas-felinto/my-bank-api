const express = require("express");
const routes = express.Router();
const fs = require("fs").promises;

routes.post("/account", async (req, res) => {
  let account = req.body;
  try {
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    account = {
      id: json.nextId++,
      ...account,
    };
    json.accounts.push(account);

    await fs.writeFile("accounts.json", JSON.stringify(json, null, 2));
    res.send("post account");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

routes.get("/accounts", async (req, res) => {
  try {
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    delete json.nextId;
    return res.send(json);
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

routes.get("/accounts/:id", async (req, res) => {
  try {
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    let accountId = json.accounts.find(
      (account) => account.id == req.params.id
    );
    return res.send(accountId);
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

routes.delete("/accounts/:id", async (req, res) => {
  try {
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    let accounts = json.accounts.filter(
      (account) => account.id != req.params.id
    );
    json.accounts = accounts;

    await fs.writeFile("accounts.json", JSON.stringify(json, null, 2));
    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

routes.put("/accounts", async (req, res) => {
  let newAccount = req.body;
  try {
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    let oldIndex = json.accounts.findIndex(
      (account) => account.id == newAccount.id
    );
    json.accounts[oldIndex] = newAccount;

    await fs.writeFile("accounts.json", JSON.stringify(json, null, 2));
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

routes.post("/accounts/transaction", async (req, res) => {
  try {
    let params = req.body;
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    let index = json.accounts.findIndex((account) => account.id == params.id);

    if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
      throw new Error("Não há saldo suficiente");
    }

    json.accounts[index].balance = json.accounts[index].balance + params.value;

    await fs.writeFile("accounts.json", JSON.stringify(json, null, 2));
    res.send(json.accounts[index]);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = routes;
