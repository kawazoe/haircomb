import {ArgumentNullDslError} from "../exceptions";
import {Expected} from "../expected";
import {Parser} from "../Parser";
import {WithExpectedParser} from "./impls/WithExpectedParser";

/**
 * An operator that extends the collection of expected results in error
 * states propagating through a parser chain with an additional set of
 * expectations.
 * @param {Array<Expected<TToken>>} expected
 *      The list of additional expected results to include in error states.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T>}
 *      Returns a function that wraps a parser chain with additional expectations.
 */
export function withExpected<TToken, T>(
    expected: Array<Expected<TToken>>
): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    if (!expected) {
        throw new ArgumentNullDslError("expected");
    }

    return function withExpectedInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new WithExpectedParser<TToken, T>(parser, expected);
    };
}
