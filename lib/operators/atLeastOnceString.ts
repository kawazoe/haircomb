import {Char} from "../Char";
import {Parser} from "../Parser";
import {chainAtLeastOnceL} from "./chainAtLeastOnceL";
import {map} from "./map";
import {pipe} from "./pipe";

export function atLeastOnceString<TToken>(): (parser: Parser<TToken, Char | string>) => Parser<TToken, string> {
    return pipe(
        chainAtLeastOnceL(() => [] as string[], (acc, c) => { acc.push(c); return acc; }),
        map(acc => acc.join(""))
    );
}
