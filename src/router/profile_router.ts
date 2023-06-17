const express = require("express");
import { MongoClient, Db, Collection } from 'mongodb';

const {
    checkRequiredPermissions,
    validateAccessToken,
  } = require("../middleware/auth0");

const profileRouter = express.Router();

/*
  (req: any, res: {
  json(docs: import("mongodb").WithId<import("bson").Document>[]): unknown; status: (arg0: number) => {
  send(arg0: string): unknown; (): any; new(): any; json: { (arg0: string): void; new(): any; }; 
}; 
})  
*/
profileRouter.post("/", validateAccessToken, async (req : any, res :any) => {
    const userID = req.body.UserID;
    const mongoURI = process.env.MONGO_URL || "";
      
    console.log(req.body.UserID);
    console.log("URL" + mongoURI);

    try {
      const client = await MongoClient.connect(mongoURI);
      const db: Db = client.db("Ice");
      const collection: Collection = db.collection('Users');
  
      const regexQuery = new RegExp(userID);
      //const user = await collection.findOne({ playerID: { $regex: regexQuery } });

      const user = await collection.find({ playerID: userID }).toArray();

      if (user.length != 1) {
        const result = await collection.insertOne({
          "name": "",
          "description": "",
          "country": "",
          "games": [
          ],
          "playerID": userID
        });

        const getInputedData = await collection.find({ playerID: userID }).toArray();

        res.status(200).json(getInputedData[0]);
      }
      else if(user.length == 1)
      {
        res.status(200).json(user[0]);
      }
      else
      {
        res.status(500).send('Multiple Documents with same ID');
      }
      
      
      client.close(); // Schließe die Verbindung zur Datenbank
    } catch (err) {
      console.error('Fehler beim Ausführen der Abfrage:', err);
      res.status(500).send('Interner Serverfehler');
    }

    
  });

export {profileRouter}
