import * as express from "express";
import { Context } from "../context";

export function createRouter(context: Context) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("index", { title: "Express" });
    });

    return router;
}
