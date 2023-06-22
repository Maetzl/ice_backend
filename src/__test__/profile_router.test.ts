import request from "supertest";
import { MongoClient, Db, Collection, ObjectId, FindCursor } from "mongodb";
import { profileRouter } from "../router/profile_router";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";

describe("Profile Router", () => {
  let app: any;
  let db: Db;
  let collection: Collection;
  let collectionGames: Collection;
  let mongoClient: MongoClient;
  const validAccessToken =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlF3SXBaaXluV1dYUm5HQ0dobTVPYiJ9.eyJpc3MiOiJodHRwczovL2ljZWdhbWluZy5ldS5hdXRoMC5jb20vIiwic3ViIjoiSW1jbm5CNlFRZDZHWU5DWndmNWp2anVlV3dVRGt2UERAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vaWNlZ2FtaW5nLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjg3NDA3MzM2LCJleHAiOjE2ODk5OTkzMzYsImF6cCI6IkltY25uQjZRUWQ2R1lOQ1p3ZjVqdmp1ZVd3VURrdlBEIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpvcmdhbml6YXRpb25zX3N1bW1hcnkgY3JlYXRlOmFjdGlvbnNfbG9nX3Nlc3Npb25zIGNyZWF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6YXV0aGVudGljYXRpb25fbWV0aG9kcyB1cGRhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyBkZWxldGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOmNsaWVudF9jcmVkZW50aWFscyBjcmVhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIHVwZGF0ZTpjbGllbnRfY3JlZGVudGlhbHMgZGVsZXRlOmNsaWVudF9jcmVkZW50aWFscyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.i08PrL6y0D-maZ3lXcWR1RF-VKrLFZDx9MiTXNNog8SmyPd7Fg8h1INYhe82IT92Qexe8ZT3kFLAUSa6mEcVSA6AV_aWB9Ws1pUzdzc5EZiK0CPQ5ii6AYVi_bsTPjgDdoMe_QtJokvsy40_QwS7vFiVs6Rxhlc-FEvLaUuOUmwSNTROnW8u9BXRJdBHYbB9_SXfq78L7PHjnohpZAdTDEFSyKkXhc32RveNoXvFaIwfvm034CWicZDhehazdOgTU31GVGz23VpbUyIFtf7ccUCCdCJU6CoycfU-TakrYkiE71S_GOQHcVax6AKwd2DyTcmP6uuJFgNopMEDqR8uFw";

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL || "";
    mongoClient = await MongoClient.connect(mongoURI);
    db = mongoClient.db("Ice");
    collection = db.collection("Users");
    collectionGames = db.collection("Games");

    console.log(process.env.AUTH0_AUDIENCE);

    app = express();
    app.use(express.json());
    app.use("/", profileRouter);
  });

  afterAll(async () => {
    mongoClient.close();
  });

  afterEach(async () => {
    await collection.deleteMany({ playerID: { $in: ["testUser"] } });
    await collectionGames.deleteMany({ gameID: { $in: ["id1","id2"] } });
  });

  describe("POST /", () => {
    // Simulate a valid access token

    it("should check if user not found", async () => {
      const userID = "testUser";

      const response = await request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID });

      expect(response.status).toBe(500);
    });

    it("should return the user if found", async () => {
      const userID = "testUser";
      const user = {
        _id: new ObjectId(),
        name: "",
        description: "",
        country: "",
        games: [],
        playerID: userID,
      };
      await collection.insertOne(user);

      const response = await request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID });

      expect(response.status).toBe(200);

      const expectedUser = {
        _id: user._id.toString(),
        name: user.name,
        description: user.description,
        country: user.country,
        games: user.games,
        playerID: userID,
      };

      expect(response.body).toEqual(expectedUser);
    }, 10000);

    it("should handle multiple documents with the same ID", async () => {
      const userID = "testUser";
      await collection.insertMany([{ playerID: userID }, { playerID: userID }]);

      const response = await request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Multiple Documents with same ID");
    });

    it("should handle internal server error", async () => {
      const userID = "testUser";
      jest.spyOn(MongoClient, "connect").mockRejectedValueOnce("Some error");

      const response = await request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Interner Serverfehler");

      jest.spyOn(MongoClient, "connect").mockRestore();
    });
  });

  describe("POST /update", () => {
    it("should update the user", async () => {
      const userID = "testUser";
      const updatedData = {
        Name: "John Doe",
        Description: "Updated description",
        Country: "USA",
      };
      const user = {
        name: "",
        description: "",
        country: "",
        games: [],
        playerID: userID,
      };
      await collection.insertOne(user);

      const response = await request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID, ...updatedData });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
      const updatedUser = await collection.findOne({ playerID: userID });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser!.name).toBe(updatedData.Name);
      expect(updatedUser!.description).toBe(updatedData.Description);
      expect(updatedUser!.country).toBe(updatedData.Country);
    });

    it("should handle multiple documents with the same ID", async () => {
      const userID = "testUser";
      await collection.insertMany([{ playerID: userID }, { playerID: userID }]);

      const response = await request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID, Name: "John Doe" });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Multiple Documents with same ID");
    });
    it("should handle error multiple documents with the same ID", async () => {
      const userID = "testUser";
      await collection.insertMany([{ playerID: userID }, { playerID: userID }]);

      const response = await request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .send({ UserID: userID, Name: "John Doe" });

      expect(response.status).toBe(401);
    });
    it("should handle internal server error when there is no user", async () => {
      const userID = "testUser";
      await collection.deleteMany({ playerID: { $in: ["testUser"] } });

      const response = await request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID, Name: "John Doe" });

      expect(response.status).toBe(500);
      expect(response.text).toBe("No User with that ID");
    });

    it("should handle internal server error", async () => {
      const userID = "testUser";
      jest.spyOn(MongoClient, "connect").mockImplementationOnce(() => {
        throw new Error("Connection error");
      });

      const response = await request(app)
        .post("/update")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({
          UserID: userID,
          Name: "John Doe",
          Description: "Some description",
          Country: "USA",
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Interner Serverfehler");

      jest.spyOn(MongoClient, "connect").mockRestore();
    });

    it("should return the basket if found", async () => {
      const userID = "testUser";
      const user = {
        _id: new ObjectId(),
        name: "",
        description: "",
        country: "",
        games: [],
        playerID: userID,
        basket: ["id1","id2"]
      };
      const game1 = 
        {
          _id: new ObjectId(123456),
          name: "",
          description: "",
          price: "",
          developerName: "",
          developerID: "", //ID of User
          releaseDate: "",
          tags: [""],
          gameID: "id1",
          images: ["images"],
          comments:[{text:"",authorID:"",authorName:""}]
      };
      const game2 = 
      {
        _id: new ObjectId(12345),
        name: "",
        description: "",
        price: "",
        developerName: "",
        developerID: "", //ID of User
        releaseDate: "",
        tags: [""],
        gameID: "id2",
        images: ["images"],
        comments:[{text:"",authorID:"",authorName:""}]
    }
      await collection.insertOne(user);
      await collectionGames.insertOne(game1);
      await collectionGames.insertOne(game2);
      const response = await request(app)
        .post("/basket")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${validAccessToken}`)
        .send({ UserID: userID });

      expect(response.status).toBe(200);

      const expectedBasket = [game1,game2];

      expect(JSON.stringify(response.body)).toEqual(JSON.stringify(expectedBasket));
    }, 10000);
  });

  // it("should buy the basket", async () => {
  //   const userID = "testUser";
  //   const user = {
  //     _id: new ObjectId(),
  //     name: "",
  //     description: "",
  //     country: "",
  //     games: [""],
  //     playerID: userID,
  //     basket: ["id1","id2"]
  //   };
  //   let userExpect = user;
  //   userExpect.games = ["id1","id2"];
  //   userExpect.basket = [];
  //   const game1 = 
  //     {
  //       _id: new ObjectId(123456),
  //       name: "",
  //       description: "",
  //       price: "",
  //       developerName: "",
  //       developerID: "", //ID of User
  //       releaseDate: "",
  //       tags: [""],
  //       gameID: "id1",
  //       images: ["images"],
  //       comments:[{text:"",authorID:"",authorName:""}]
  //   };
  //   const game2 = 
  //   {
  //     _id: new ObjectId(12345),
  //     name: "",
  //     description: "",
  //     price: "",
  //     developerName: "",
  //     developerID: "", //ID of User
  //     releaseDate: "",
  //     tags: [""],
  //     gameID: "id2",
  //     images: ["images"],
  //     comments:[{text:"",authorID:"",authorName:""}]
  // }
  //   await collection.insertOne(user);
  //   await collectionGames.insertOne(game1);
  //   await collectionGames.insertOne(game2);
  //   const response = await request(app)
  //     .post("/buybasket")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${validAccessToken}`)
  //     .send({ UserID: userID });

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual([userExpect]);
  // }, 10000);

  // it("should remove an item of the basket", async () => {
  //   const userID = "testUser";
  //   const user = {
  //     _id: new ObjectId(123),
  //     name: "",
  //     description: "",
  //     country: "",
  //     games: [""],
  //     playerID: userID,
  //     basket: ["id1","id2"]
  //   };
  //   let userExpect = user;
  //   userExpect.basket = ["id1"];
    
  //   const game1 = 
  //     {
  //       _id: new ObjectId(123456),
  //       name: "",
  //       description: "",
  //       price: "",
  //       developerName: "",
  //       developerID: "", //ID of User
  //       releaseDate: "",
  //       tags: [""],
  //       gameID: "id1",
  //       images: ["images"],
  //       comments:[{text:"",authorID:"",authorName:""}]
  //   };
  //   const game2 = 
  //   {
  //     _id: new ObjectId(12345),
  //     name: "",
  //     description: "",
  //     price: "",
  //     developerName: "",
  //     developerID: "", //ID of User
  //     releaseDate: "",
  //     tags: [""],
  //     gameID: "id2",
  //     images: ["images"],
  //     comments:[{text:"",authorID:"",authorName:""}]
  // }
  //   await collection.insertOne(user);
  //   await collectionGames.insertOne(game1);
  //   await collectionGames.insertOne(game2);
  //   const response = await request(app)
  //     .post("/removebasket")
  //     .set("Content-Type", "application/json")
  //     .set("Authorization", `Bearer ${validAccessToken}`)
  //     .send({ UserID: userID });

  //   expect(response.status).toBe(200);
  //   expect(JSON.stringify(response.body)).toEqual(JSON.stringify(userExpect));
  // }, 10000);
});
