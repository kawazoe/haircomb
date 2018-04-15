import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {map} from "./map";

export function between<TToken, TResult, TSource>(
    parserLeft: Parser<TToken, TSource>,
    parserRight?: Parser<TToken, TSource>
): (parser: Parser<TToken, TResult>) => Parser<TToken, TResult> {
    if (!parserLeft) {
        throw new ArgumentNullDslError("parserLeft");
    }

    if (!parserRight) {
        return between(parserLeft, parserLeft);
    }

    return function betweenInternal(parser: Parser<TToken, TResult>): Parser<TToken, TResult> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return map(parser, parserRight, (_: TSource, r: TResult) => r)(parserLeft);
    };
}
