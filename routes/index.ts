import * as express from "express";

export const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
    res.render("index", { title: "Express" });
});
