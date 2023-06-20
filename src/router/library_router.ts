const express = require("express");
import { MongoClient, Db, Collection } from "mongodb";

const { validateAccessToken } = require("../middleware/auth0");

const libraryRouter = express.Router();

libraryRouter.post("/", validateAccessToken, async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  const userID = req.body.UserID;

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");
    const collection: Collection = db.collection("Users");

    const result = await collection.find({ playerID: userID }).toArray();
    const games = result[0].games;

    res.status(200).send(games);

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});

export { libraryRouter };
