const express = require("express");

const {
    checkRequiredPermissions,
    validateAccessToken,
  } = require("../middleware/auth0");

const profileRouter = express.Router();

profileRouter.post("/", validateAccessToken, (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): void; new(): any; }; }; }) => {
    const message = "Profile Data";
    
    console.log(req.body);
    
    res.status(200).json(req.body);
  });

export {profileRouter}