import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {SeparatedAtLeastOnceParser} from "./impls/SeparatedAtLeastOnceParser";

/**
 * An operator that alternates between a value parser and a separator parser until no
 * more separated values can be found.
 * @param {Parser<TToken, TSeparation>} separator
 *      The separator parser to execute.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T[]>}
 *      Returns a function that alternates between a parser chain and a separator parser.
 */
export function separatedAtLeastOnce<TToken, T, TSeparation>(
    separator: Parser<TToken, TSeparation>
): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    if (!separator) {
        throw new ArgumentNullDslError("separator");
    }

    return function separatedAtLeastOnceInternal(parser: Parser<TToken, T>): Parser<TToken, T[]> {
        return new SeparatedAtLeastOnceParser<TToken, T, TSeparation>(parser, separator);
    };
}
