import * as express from "express";
import { Context } from "../context";
import { giveCCC } from "../logic";

export function createRouter(context: Context) {
    const router = express.Router();

    router.post("/requestMoney", async (req, res) => {
        console.log(`req body is ${JSON.stringify(req.body)}`);
        const { to } = req.body;
        const amount = "1";

        try {
            const hash = await giveCCC(context, to, amount);
            res.json({
                success: true,
                hash
            });
        } catch (err) {
            res.json({
                success: false,
                err
            })
        }
    });

    return router;
}
