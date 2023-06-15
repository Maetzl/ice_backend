const express = require("express");

const {
    checkRequiredPermissions,
    validateAccessToken,
  } = require("../middleware/auth0");

const profileRouter = express.Router();

profileRouter.get("/", validateAccessToken, (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): void; new(): any; }; }; }) => {
    const message = "Profile Content";
    
    console.log(req);
  
    res.status(200).json(message);
  });

export {profileRouter}