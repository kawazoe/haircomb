import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {atLeastOnce} from "./atLeastOnce";
import {before} from "./before";
import {pipe} from "./pipe";

export function separatedAndTerminatedAtLeastOnce<TToken, T, TSeparation>(
    separator: Parser<TToken, TSeparation>
): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    if (!separator) {
        throw new ArgumentNullDslError("separator");
    }

    return pipe(
        before(separator),
        atLeastOnce()
    );
}
