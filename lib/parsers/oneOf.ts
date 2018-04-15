import {expandArguments} from "../expandArguments";
import {Parser} from "../Parser";
import {OneOfParser} from "./impls/OneOfParser";

/**
 * A parser that returns the first successful result of a collection of parsers.
 * @param {Parser<TToken, T>} parsers
 *      A collection of parsers that will be used, in order, to attempt to
 *      parse the input state.
 * @returns {Parser<TToken, T[]>}
 */
export function oneOf<TToken, T>(...parsers: Array<Parser<TToken, T>>): Parser<TToken, T[]>;
export function oneOf<TToken, T>(parsers: Array<Parser<TToken, T>>): Parser<TToken, T[]>;
export function oneOf<TToken, T>(): Parser<TToken, T[]> {
    const args = expandArguments(arguments);

    return new OneOfParser<TToken, T>(args);
}
