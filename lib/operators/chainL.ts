import {Parser} from "../Parser";
import {UNIT} from "../parsers/unit";
import {chainAtLeastOnceL} from "./chainAtLeastOnceL";
import {map} from "./map";
import {or} from "./or";
import {pipe} from "./pipe";

function returnSeed<TToken, TNext>(seed: () => TNext): Parser<TToken, TNext> {
    return map(() => seed())(UNIT);
}

export function chainL<TToken, T, TNext>(
    seed: () => TNext,
    combinator: (next: TNext, value: T) => TNext
): (parser: Parser<TToken, T>) => Parser<TToken, TNext> {
    return pipe(
        chainAtLeastOnceL(seed, combinator),
        or(returnSeed(seed))
    );
}
