const express = require("express");
const {
  getAdminMessage,
  getProtectedMessage,
  getPublicMessage,
} = require("./messages_service");
const {
  checkRequiredPermissions,
  validateAccessToken,
} = require("../middleware/auth0");
const { AdminMessagesPermissions } = require("./messages_permissions");

const messagesRouter = express.Router();

messagesRouter.get("/public", (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
  const message = getPublicMessage();

  res.status(200).json(message);
});

messagesRouter.get("/protected", validateAccessToken, (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
  console.log(req);
  const message = getProtectedMessage();

  res.status(200).json(message);
});

messagesRouter.get(
  "/admin",
  validateAccessToken,
  checkRequiredPermissions([AdminMessagesPermissions.Read]),
  (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
    const message = getAdminMessage();

    res.status(200).json(message);
  }
);

module.exports = { messagesRouter };

export{ messagesRouter }