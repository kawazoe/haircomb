import {Parser} from "../Parser";
import {EMPTY} from "../parsers/empty";
import {atLeastOnce} from "./atLeastOnce";
import {or} from "./or";
import {pipe} from "./pipe";

export function many<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    return pipe(
        atLeastOnce(),
        or(EMPTY)
    );
}
