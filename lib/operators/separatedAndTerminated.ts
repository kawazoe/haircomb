import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {before} from "./before";
import {many} from "./many";
import {pipe} from "./pipe";

export function separatedAndTerminated<TToken, T, TSeparation>(
    separator: Parser<TToken, TSeparation>
): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    if (!separator) {
        throw new ArgumentNullDslError("separator");
    }

    return pipe(
        before(separator),
        many()
    );
}
