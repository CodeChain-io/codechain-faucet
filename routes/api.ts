import * as express from "express";
import { Context } from "../context";
import { giveCCCWithLimit, giveCCCWithoutLimit } from "../logic";
import { verifyCaptcha } from "../logic/captcha";
import { ErrorCode, FaucetError } from "../logic/error";
import { findCCCAddressFromText } from "../logic/index";
import { errorMessage, successMessage } from "../logic/message";
import {
    getFacebookContent,
    getTwitContent,
    parseURL,
    URLType
} from "../logic/sns";
import * as historyModel from "../model/history";

export function createRouter(context: Context) {
    const router = express.Router();

    router.post("/requestMoneyBySNS", async (req, res) => {
        console.log(`req body is ${JSON.stringify(req.body)}`);
        const { url, captcha } = req.body;

        const amount = String(1000 * 1000 * 1000);
        try {
            const captchaResult = await verifyCaptcha(context, captcha);
            if (captchaResult === false) {
                throw new FaucetError(ErrorCode.InvalidCaptcha, null);
            }

            const parseResult = parseURL(url);
            const postType = parseResult[0];
            const postId = parseResult[1];

            let content = "";

            if (postType === URLType.Twitter) {
                content = await getTwitContent(context, postId);
            } else if (postType === URLType.Facebook) {
                content = await getFacebookContent(postId);
            } else {
                throw new FaucetError(ErrorCode.Unknown, null);
            }

            if (
                content
                    .toLowerCase()
                    .indexOf(context.config.marketingText.toLowerCase()) === -1
            ) {
                console.log(
                    `marketingText: ${
                        context.config.marketingText
                    }\n content: ${content}`
                );
                throw new FaucetError(ErrorCode.NoMarketingText, null);
            }

            const exists = await historyModel.existsById(context, postId);
            if (exists) {
                throw new FaucetError(ErrorCode.DuplicatedPost, null);
            }

            const to = findCCCAddressFromText(context, content);
            if (to === null) {
                throw new FaucetError(ErrorCode.InvalidAddress, null);
            }
            const hash = await giveCCCWithLimit(context, to, amount, postId);

            res.json({
                success: true,
                hash,
                message: successMessage(context, hash.toEncodeObject())
            });
        } catch (err) {
            res.json({
                success: false,
                err,
                message: errorMessage(context, err)
            });
        }
    });

    if (context.config.enableTestAPI) {
        router.post("/testMoney", async (req, res) => {
            const { to, secret } = req.body;

            const amount = String(1000 * 1000 * 1000);
            try {
                if (secret !== context.config.testAPISecret) {
                    throw new FaucetError(ErrorCode.NotAuthorizedForTest, null);
                }

                const hash = await giveCCCWithoutLimit(context, to, amount);
                res.json({
                    success: true,
                    hash,
                    message: successMessage(context, hash.toEncodeObject())
                });
            } catch (err) {
                res.json({
                    success: false,
                    err,
                    message: errorMessage(context, err)
                });
            }
        });
    }

    return router;
}
