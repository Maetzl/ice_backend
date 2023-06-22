const express = require("express");
import { MongoClient, Db, Collection } from "mongodb";

const { validateAccessToken } = require("../middleware/auth0");

const gamesRouter = express.Router();

gamesRouter.post("/", async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");
    const collection: Collection = db.collection("Games");

    const games = await collection.find({}).toArray();

    res.status(200).send(games);

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});

gamesRouter.post(
  "/publish",
  validateAccessToken,
  async (req: any, res: any) => {
    const mongoURI = process.env.MONGO_URL || "";

    const name = req.body.Name;
    const description = req.body.Description;
    const price = req.body.Price;
    var developerName = "";
    const developerID = req.body.DeveloperID;
    const releaseDate = req.body.ReleaseDate;
    const tags = req.body.Tags.toString().split(",");
    const gameID = req.body.GameID;
    const images = req.body.Images.toString().split(",");

    console.log("Publish Body: ", req.body);

    if (!name || !price || !developerID || !releaseDate) {
      res.status(500).send("Missing Data in Body");
    }

    try {
      const client = await MongoClient.connect(mongoURI);
      const db: Db = client.db("Ice");
      const games: Collection = db.collection("Games");
      const users: Collection = db.collection("Users");

      const user = await users.find({ playerID: developerID }).toArray();

      developerName = user[0].name;
      console.log(developerName);

      const game = await games.find({ gameID: gameID }).toArray();

      if (game.length == 0) {
        const result = await games.insertOne({
          name: name,
          description: description,
          price: price,
          developerName: developerName,
          developerID: developerID, //ID of User
          releaseDate: releaseDate,
          tags: tags,
          gameID: gameID,
          images: images,
        });
      } else {
        res.status(500).send("Game is already in Database");
      }

      res.status(200).send();

      client.close(); // Schließe die Verbindung zur Datenbank
    } catch (err) {
      console.error("Fehler beim Ausführen der Abfrage:", err);
      res.status(500).send("Interner Serverfehler");
    }
  }
);

gamesRouter.post("/game", async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  const gameID = req.body.GameID;

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");
    const collection: Collection = db.collection("Games");

    const games = await collection.find({ gameID: gameID }).toArray();

    res.status(200).send(games);

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});

gamesRouter.post("/devGames", async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  const userID = req.body.UserID;
  console.log("112", userID);
  console.log("113", req.body);

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");
    const collection: Collection = db.collection("Games");

    const games = await collection.find({ developerID: userID }).toArray();

    console.log("games 120", games);

    res.status(200).send(games);

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});

gamesRouter.post("/removeGame", async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  const userID = req.body.UserID;
  const gameID = req.body.GameID;
  console.log("112", userID);
  console.log("113", req.body);

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");
    const collection: Collection = db.collection("Games");

    await collection.deleteOne({ gameID: gameID });

    res.status(200).send();

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});

gamesRouter.post("/edit", validateAccessToken, async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  const name = req.body.Name;
  const description = req.body.Description;
  const price = req.body.Price;
  var developerName = "";
  const developerID = req.body.DeveloperID;
  const releaseDate = req.body.ReleaseDate;
  const tags = req.body.Tags.toString().split(",");
  const gameID = req.body.GameID;

  console.log("Publish Body: ", req.body);

  if (!name || !price || !developerID || !releaseDate) {
    res.status(500).send("Missing Data in Body");
  }

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");
    const games: Collection = db.collection("Games");
    const users: Collection = db.collection("Users");

    const user = await users.find({ playerID: developerID }).toArray();

    developerName = user[0].name;
    console.log(developerName);

    const result = await games.updateOne(
      { gameID: gameID },
      {
        $set: {
          name: name,
          description: description,
          price: price,
          developerName: developerName,
          developerID: developerID, //ID of User
          releaseDate: releaseDate,
          tags: tags,
          gameID: gameID,
        },
      }
    );

    res.status(200).send();

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});

gamesRouter.post("/addbasket", async (req: any, res: any) => {
  const mongoURI = process.env.MONGO_URL || "";

  const gameID = req.body.GameID;
  const userID = req.body.UserID;

  try {
    const client = await MongoClient.connect(mongoURI);
    const db: Db = client.db("Ice");

    const collectionUsers: Collection = db.collection("Users");

    const addGame = {
      $push: { basket: gameID },
    };

    await collectionUsers.updateOne({ playerID: userID }, addGame);
    res.status(200);

    client.close(); // Schließe die Verbindung zur Datenbank
  } catch (err) {
    console.error("Fehler beim Ausführen der Abfrage:", err);
    res.status(500).send("Interner Serverfehler");
  }
});
export { gamesRouter };
