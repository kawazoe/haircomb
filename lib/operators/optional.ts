import {Just, Maybe, Nothing} from "../maybe";
import {Parser} from "../Parser";
import {value} from "../parsers/value";
import {map} from "./map";
import {or} from "./or";
import {pipe} from "./pipe";

export function optional<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, Maybe<T>> {
    return pipe(
        map(Just),
        or(value(Nothing))
    );
}
