import {Parser} from "../Parser";
import {ReturnParser} from "./impls/ReturnParser";

/**
 * A parser that always succeeds with a given value.
 * @param {T} v
 *      The value that this parser should return.
 * @returns {Parser<TToken, T>}
 */
export function value<TToken, T>(v: T): Parser<TToken, T> {
    return new ReturnParser<TToken, T>(v);
}
