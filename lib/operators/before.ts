import {Parser} from "../Parser";
import {then} from "./then";

export function before<TToken, T, TDelimiter>(delimiter: Parser<TToken, TDelimiter>): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    return then(delimiter, l => l);
}
