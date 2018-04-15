import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {EMPTY} from "../parsers/empty";
import {or} from "./or";
import {pipe} from "./pipe";
import {separatedAndOptionallyTerminatedAtLeastOnce} from "./separatedAndOptionallyTerminatedAtLeastOnce";

export function separatedAndOptionallyTerminated<TToken, T, TSeparation>(
    separator: Parser<TToken, TSeparation>
): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    if (!separator) {
        throw new ArgumentNullDslError("separator");
    }

    return pipe(
        separatedAndOptionallyTerminatedAtLeastOnce(separator),
        or(EMPTY)
    );
}
