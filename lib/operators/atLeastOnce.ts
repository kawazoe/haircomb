import {Parser} from "../Parser";
import {chainAtLeastOnceL} from "./chainAtLeastOnceL";

export function atLeastOnce<TToken, T>(): (parser: Parser<TToken, T>) => Parser<TToken, T[]> {
    return chainAtLeastOnceL(() => [] as T[], (acc, v) => { acc.push(v); return acc; });
}
