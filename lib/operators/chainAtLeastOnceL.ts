import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {ChainAtLeastOnceLParser} from "./impls/ChainParser";

/**
 * An operator that applies a the previously chained parser as many times as they succeeds
 * to build a buffer of results.
 * @param {() => TAccumulator} seed
 *      The starting value of the accumulator of results.
 * @param {(accumulator: TAccumulator, value: T) => TAccumulator} combinator
 *      A function that takes an accumulator value and append the current value
 *      to produce a new accumulator.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, TAccumulator>}
 *      Returns a function that wraps a parser with the accumulator.
 */
export function chainAtLeastOnceL<TToken, T, TAccumulator>(
    seed: () => TAccumulator,
    combinator: (accumulator: TAccumulator, value: T) => TAccumulator
): (parser: Parser<TToken, T>) => Parser<TToken, TAccumulator> {
    if (!seed) {
        throw new ArgumentNullDslError("seed");
    }

    if (!combinator) {
        throw new ArgumentNullDslError("combinator");
    }

    return function chainAtLeastOnceLInternal(parser: Parser<TToken, T>): Parser<TToken, TAccumulator> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new ChainAtLeastOnceLParser(parser, seed, combinator);
    };
}
