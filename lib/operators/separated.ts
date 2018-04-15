import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {EMPTY} from "../parsers/empty";
import {or} from "./or";
import {pipe} from "./pipe";
import {separatedAtLeastOnce} from "./separatedAtLeastOnce";

export function separated<TToken, T, TSeparation>(
    separator: Parser<TToken, TSeparation>
): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    if (!separator) {
        throw new ArgumentNullDslError("separator");
    }

    return pipe(
        separatedAtLeastOnce(separator),
        or(EMPTY)
    );
}
