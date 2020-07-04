const express = require("express");
const AccountsController = require("../controllers/AccountsController");
const routes = express.Router();

routes.post("/account", AccountsController.create);
routes.get("/accounts", AccountsController.show);
routes.get("/accounts/:id", AccountsController.find);
routes.delete("/accounts/:id", AccountsController.delete);
routes.put("/accounts", AccountsController.put);
routes.post("/accounts/transaction", AccountsController.transaction);

module.exports = routes;
