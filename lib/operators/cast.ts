import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";

/**
 * An operator that simulates a strongly-typed cast to better hint the typescript
 * compiler which type a parser should have in a chain.
 * @param {TNew} _sentinel
 *      A placeholder value used to represent the target type of the cast.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, TNew>}
 *      Returns a function that returns the input parser casted to the new type.
 */
// noinspection JSUnusedLocalSymbols - used as a cast sentinel
export function cast<TToken, T, TNew>(
    _sentinel: TNew
): (parser: Parser<TToken, T>) => Parser<TToken, TNew> {
    return function castInternal(parser: Parser<TToken, T>): Parser<TToken, TNew> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return parser as Parser<TToken, TNew>;
    };
}
