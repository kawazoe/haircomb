import {Parser} from "../Parser";
import {chainAtLeastOnceL} from "./chainAtLeastOnceL";

export function skipAtLeastOnce<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, undefined> {
    return chainAtLeastOnceL(() => undefined, acc => acc);
}
