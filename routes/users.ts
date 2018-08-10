import * as express from "express";

export const router = express.Router();

/* GET users listing. */
router.get("/", function (_req, res, _next) {
  res.send("respond with a resource");
});
