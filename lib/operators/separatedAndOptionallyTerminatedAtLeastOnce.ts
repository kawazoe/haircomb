import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {SeparatedAndOptionallyTerminatedAtLeastOnceParser} from "./impls/SeparatedAndOptionallyTerminatedAtLeastOnceParser";

/**
 * An operator that alternates between a value parser and a separator parser until one of them fails.
 * @param {Parser<TToken, TSeparation>} separator
 *      The separator parser to execute.
 * @returns {(parser: Parser<TToken, T>) => Parser<TToken, T[]>}
 *      Returns a function that alternates between a parser chain and a separator parser.
 */
export function separatedAndOptionallyTerminatedAtLeastOnce<TToken, T, TSeparation>(
    separator: Parser<TToken, TSeparation>
): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    if (!separator) {
        throw new ArgumentNullDslError("separator");
    }

    return function separatedAndOptionallyTerminatedAtLeastOnceInternal(parser: Parser<TToken, T>): Parser<TToken, T[]> {
        return new SeparatedAndOptionallyTerminatedAtLeastOnceParser<TToken, T, TSeparation>(parser, separator);
    };
}
