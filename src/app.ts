import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import nocache from 'nocache';
import { profileRouter } from './router/profile_router';
import { gamesRouter } from './router/games_router';
const { messagesRouter } = require("./messages/messages_router");
const { errorHandler } = require("./middleware/error");
const { notFoundHandler } = require("./middleware/not-found");

dotenv.config();

//const config = {
//  authRequired: false,
//  auth0Logout: true,
//  secret: process.env.AUTH0_SECRET,
//  baseURL: 'http://localhost:8000',
//  clientID: 'UoB5ylfLxwPujRPQ5FIlCTpxixmXQ4Jx',
//  issuerBaseURL: 'https://icegaming.eu.auth0.com'
//};

const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const app = express();
const apiRouter = express.Router();

//app.use(auth(config));

app.get('/', (req: Request, res: Response) => {
  res.send("Backend");
});

//app.get('/profile', requiresAuth(), (req, res) => {
//  res.send(JSON.stringify(req.oidc.user));
//});

app.use(express.json());
app.set("json spaces", 2);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type", "UserName"],
    maxAge: 86400,
  })
);

app.use("/api", apiRouter);
apiRouter.use("/messages", messagesRouter);

//app.use("/", apiRouter)
apiRouter.use("/profile", profileRouter);
apiRouter.use("/games", gamesRouter);

app.use(errorHandler);
app.use(notFoundHandler);

export {app}