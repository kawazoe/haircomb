import {expandArguments} from "../expandArguments";
import {Parser} from "../Parser";
import {ParserSequenceParser} from "./impls/ParserSequenceParser";

/**
 * A parser that executes a collection of parsers in order until either completion or one fails.
 * @param {Parser<TToken, T>} parsers
 *      The list of parsers to execute.
 * @returns {Parser<TToken, T[]>}
 */
export function parserSequence<TToken, T>(...parsers: Array<Parser<TToken, T>>): Parser<TToken, T[]>;
export function parserSequence<TToken, T>(parsers: Array<Parser<TToken, T>>): Parser<TToken, T[]>;
export function parserSequence<TToken, T>(): Parser<TToken, T[]> {
    const args = expandArguments(arguments);

    return new ParserSequenceParser<TToken, T>(args);
}
