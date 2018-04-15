import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {BindParser} from "./impls/BindParser";

/**
 * An operator that selects and executes a parser based on the result of the chain.
 * @param {(value: T) => Parser<TToken, TNext>} binder
 *      A function that returns the next parser to execute based on the previous value.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, TResult>}
 *      Returns a function that wraps a parser with the binder.
 */
export function bind<TToken, T, TNext>(
    binder: (value: T) => Parser<TToken, TNext>
): (parser: Parser<TToken, T>) => Parser<TToken, TNext>;
/**
 * An operator that selects and executes a parser based on the result of the chain.
 * @param {(value: T) => Parser<TToken, TNext>} binder
 *      A function that returns the next parser to execute based on the previous value.
 * @param {(value: T, nextValue: TNext) => TResult} combinator
 *      An optional function that combines the previous value and the new value to produce the final result.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, TResult>}
 *      Returns a function that wraps a parser with the binder and combinator.
 */
export function bind<TToken, T, TNext, TResult>(
    binder: (value: T) => Parser<TToken, TNext>,
    combinator: (value: T, nextValue: TNext) => TResult
): (parser: Parser<TToken, T>) => Parser<TToken, TResult>;
export function bind<TToken, T, TNext, TResult>(
    binder: (value: T) => Parser<TToken, TNext>,
    combinator?: (value: T, nextValue: TNext) => TResult
): (parser: Parser<TToken, T>) => Parser<TToken, TResult> {
    if (!binder) {
        throw new ArgumentNullDslError("binder");
    }

    if (!combinator) {
        return bind(binder, (_, u) => u);
    }

    return function bindInternal(parser: Parser<TToken, T>): Parser<TToken, TResult> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new BindParser<TToken, T, TNext, TResult>(parser, binder, combinator);
    };
}
