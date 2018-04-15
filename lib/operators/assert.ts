import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {AssertParser} from "./impls/AssertParser";

/**
 * An operator that fails a chain when a predicate is not met.
 * @param {(v: T) => boolean} predicate
 *      A predicate to evaluate the fitness of the previous parser's result.
 * @param {string | ((value: T) => string)} message
 *      An optional message or function that produces a message to include in
 *      the resulting state upon failure.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T>}
 *      Returns a function that wraps a parser with the assertion.
 */
export function assert<TToken, T>(
    predicate: (v: T) => boolean,
    message?: string | ((value: T) => string)
): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    if (!predicate) {
        throw new ArgumentNullDslError("predicate");
    }

    if (typeof message === "string") {
        return function assertInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
            if (!parser) {
                throw new ArgumentNullDslError("parser");
            }

            return new AssertParser<TToken, T>(parser, predicate, () => message);
        };
    }

    if (typeof message === "function") {
        return function assertInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
            if (!parser) {
                throw new ArgumentNullDslError("parser");
            }

            return new AssertParser<TToken, T>(parser, predicate, message);
        };
    }

    return function assertInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new AssertParser<TToken, T>(parser, predicate, () => "Assertion failed");
    };
}
