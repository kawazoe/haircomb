import {Char} from "../Char";
import {Parser} from "../Parser";
import {EMPTY_STRING} from "../parsers/emptyString";
import {atLeastOnceString} from "./atLeastOnceString";
import {or} from "./or";
import {pipe} from "./pipe";

export function manyString<TToken>(): (parser: Parser<TToken, Char | string>) => Parser<TToken, string> {
    return pipe(
        atLeastOnceString(),
        or(EMPTY_STRING)
    );
}
