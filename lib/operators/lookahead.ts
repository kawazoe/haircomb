import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {LookaheadParser} from "./impls/LookaheadParser";

/**
 * An operator that that peeks at the result of a chained parser without consuming any input.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T>}
 *      Returns a function that looks ahead of a wrapped parser.
 */
export function lookahead<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    return function lookaheadInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new LookaheadParser<TToken, T>(parser);
    };
}
