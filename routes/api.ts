import * as express from "express";
import { Context } from "../context";
import { giveCCC } from "../logic";
import { getTwitContent, parseTwitterURL } from "../logic/twitter";
import { FaucetError, ErrorCode } from "../logic/error";
import { findCCCAddressFromText } from "../logic/index";
import { verifyCaptcha } from "../logic/captcha";
import * as historyModel from "../model/history";

export function createRouter(context: Context) {
    const router = express.Router();

    router.post("/requestMoneyBySNS", async (req, res) => {
        console.log(`req body is ${JSON.stringify(req.body)}`);
        const { url, captcha } = req.body;

        const amount = "1";
        try {
            const captchaResult = await verifyCaptcha(context, captcha);
            if (captchaResult === false) {
                throw new FaucetError(ErrorCode.InvalidCaptcha, null);
            }
            const content = await getTwitContent(context, url);
            if (content.indexOf(context.config.maketingText) === -1) {
                console.log(`maketingText: ${context.config.maketingText}\n content: ${content}`);
                throw new FaucetError(ErrorCode.NoMaketingText, null);
            }

            const tweetId = parseTwitterURL(url) as string;
            const exists = await historyModel.existsByTweetId(context, tweetId);
            if (exists) {
                throw new FaucetError(ErrorCode.DuplicatedTweet, null);
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
