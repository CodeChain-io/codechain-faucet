import * as express from "express";
import { Context } from "../context";
import { giveCCC } from "../logic";
import { getTwitContent } from "../logic/twitter";
import { FaucetError, ErrorCode } from "../logic/error";
import { findCCCAddressFromText } from "../logic/index";

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

    router.post("/requestMoneyBySNS", async (req, res) => {
        console.log(`req body is ${JSON.stringify(req.body)}`);
        const { url } = req.body;

        const amount = "1";
        try {
            const content = await getTwitContent(context, url);
            if (content.indexOf(context.config.maketingText) === -1) {
                console.log(`maketingText: ${context.config.maketingText}\n content: ${content}`);
                throw new FaucetError(ErrorCode.NoMaketingText, null);
            }

            const to = findCCCAddressFromText(content);
            if (to === null) {
                throw new FaucetError(ErrorCode.InvalidAddress, null);
            }

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
