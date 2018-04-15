import {Parser} from "../Parser";
import {TokenParser} from "./impls/TokenParser";

/**
 * A parser that expects a given token from the input state.
 * @param {TToken} t
 *      The expected token.
 * @returns {Parser<TToken, T>}
 */
export function token<TToken, T>(t: TToken): Parser<TToken, T> {
    return new TokenParser<TToken, T>(t);
}
