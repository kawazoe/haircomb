import {Parser} from "../Parser";
import {UNIT} from "../parsers/unit";
import {or} from "./or";
import {pipe} from "./pipe";
import {skipAtLeastOnce} from "./skipAtLeastOnce";

export function skipMany<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, undefined> {
    return pipe(
        skipAtLeastOnce(),
        or(UNIT)
    );
}
