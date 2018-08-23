import { Context } from "../context";
import * as rp from "request-promise";

export async function verifyCaptcha(
    context: Context,
    captcha: string
): Promise<boolean> {
    const secret = context.config.recaptchaSecret;
    let result = await rp.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`
    );
    result = JSON.parse(result);
    if (result.success) {
        return true;
    }
    console.log(`User captcha failed ${JSON.stringify(result)}`);
    return false;
}
