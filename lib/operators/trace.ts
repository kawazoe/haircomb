import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {tap} from "./tap";

export function trace<TToken, T>(
    logger: (message: any) => void,
    message: string | ((value: T) => any)
): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    if (!logger) {
        throw new ArgumentNullDslError("logger");
    }

    if (!message) {
        throw new ArgumentNullDslError("message");
    }

    let messageProvider: (v: T) => string;

    if (typeof message === "string") {
        messageProvider = () => message;
    } else {
        messageProvider = message;
    }

    return tap((v: T) => logger(messageProvider(v)));
}
