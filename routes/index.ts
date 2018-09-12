import * as express from "express";
import { Context } from "../context";

export function createRouter(context: Context) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("index", {
            title: "CodeChain Faucet",
            recaptchaSiteKey: context.config.recaptchaSiteKey,
            googleAnalyticsId: context.config.googleAnalyticsId,
            marketingText: context.config.marketingText,
            facebookExampleURL: context.config.facebookExampleURL,
            twitterExampleURL: context.config.twitterExampleURL,
            twitterShareText:
                "I%20love%20CodeChain%0A%3CYour%20Platform%20Account%20Address%20Here%3E%0AHusky%20CodeChain%20Testnet"
        });
    });

    return router;
}
