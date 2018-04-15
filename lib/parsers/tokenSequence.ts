import {expandArguments} from "../expandArguments";
import {Parser} from "../Parser";
import {TokenSequenceParser} from "./impls/TokenSequenceParser";

/**
 * A parser that expects a collection of tokens from an input state.
 * @param {TToken[]} tokens
 *      The collection of tokens to expect.
 * @returns {Parser<TToken, TToken[]>}
 */
export function tokenSequence<TToken>(tokens: TToken[]): Parser<TToken, TToken[]>;
export function tokenSequence<TToken>(...tokens: TToken[]): Parser<TToken, TToken[]>;
export function tokenSequence<TToken, T>(): Parser<TToken, T[]> {
    const args = expandArguments(arguments);

    return new TokenSequenceParser<TToken>(args);
}
