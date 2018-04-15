import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {SafeParser} from "./impls/SafeParser";

/**
 * An operator that peeks at the result of a parser chain and does not consumes any
 * input if the chain fails.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T>}
 *      Returns a function that wraps a parser into a safe execution chain.
 */
export function safe<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    return function safeInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new SafeParser<TToken, T>(parser);
    };
}
