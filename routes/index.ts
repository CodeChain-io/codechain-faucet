import * as express from "express";

export const router = express.Router();

/* GET home page. */
router.get("/", function(_req, res, _next) {
  res.render("index", { title: "Express" });
});

