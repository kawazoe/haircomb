import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {NegatedParser} from "./impls/NegatedParser";

/**
 * An operator that inverse the expectation of a parser chain.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T>}
 *      Returns a function that wraps a parser chain and negate its expectation.
 */
export function not<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    return function notInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new NegatedParser<TToken, T>(parser);
    };
}
