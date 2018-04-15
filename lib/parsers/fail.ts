import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {FailParser} from "./impls/FailParser";

/**
 * A parser that always fails.
 * @param {string} message
 *      The message to include in the error.
 * @returns {Parser<TToken, T>}
 */
export function fail<TToken, T>(message: string): Parser<TToken, T> {
    if (!message) {
        throw new ArgumentNullDslError("message");
    }

    return new FailParser<TToken, T>(message);
}
