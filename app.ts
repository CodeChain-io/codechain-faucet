import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as createError from "http-errors";
import * as logger from "morgan";
import * as sassMiddleware from "node-sass-middleware";
import * as path from "path";
const morganBody = require("morgan-body");

import { Context, createContext } from "./context";
import { createRouter as createApiRouter } from "./routes/api";
import { createRouter as createIndexRouter } from "./routes/index";
import { createRouter as createUsersRouter } from "./routes/users";

export async function createApp(): Promise<[express.Application, Context]> {
    const app = express();

    // view engine setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "pug");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(
        sassMiddleware({
            src: path.join(__dirname, "public"),
            dest: path.join(__dirname, "public"),
            indentedSyntax: true, // true = .sass and false = .scss
            sourceMap: true,
            prefix: "/faucet"
        })
    );
    app.use("/faucet", express.static(path.join(__dirname, "public")));
    morganBody(app);

    const context = await createContext();
    app.use("/faucet/", createIndexRouter(context));
    app.use("/faucet/users", createUsersRouter(context));
    app.use("/faucet/api", createApiRouter(context));

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404));
    });

    // error handler
    app.use((err: any, req: express.Request, res: express.Response) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};
        console.error(err);

        // render the error page
        res.status(err.status || 500);
        res.render("error");
    });
    return [app, context];
}
