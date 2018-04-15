import {DslError} from "../exceptions";
import {Parser} from "../Parser";
import {bind} from "./bind";
import {map} from "./map";

export function then<TToken, TLeft, TResult>(
    parser: Parser<TToken, TResult> | ((left: TLeft) => Parser<TToken, TResult>),
): (parser: Parser<TToken, TLeft>) => Parser<TToken, TResult>;
export function then<TToken, TLeft, TRight, TResult>(
    parser: Parser<TToken, TRight> | ((left: TLeft) => Parser<TToken, TResult>),
    selector: (left: TLeft, right: TRight) => TResult
): (parser: Parser<TToken, TLeft>) => Parser<TToken, TResult>;
export function then<TToken, TLeft, TResult>(
    ...args: any[]
): (parser: Parser<TToken, TLeft>) => Parser<TToken, TResult> {
    const parser = args[0] || null;
    const selector = args[1] || null;

    if (typeof parser === "function") {
        return bind(parser, selector);
    }

    if (typeof parser !== "function") {
        if (selector) {
            return map(parser, selector);
        }

        return map(parser, (_, u) => u);
    }

    throw new DslError(
        "Expected between one and two arguments, " +
        "the first one of type function or Parser<TToken, TResult> " +
        "and the second of type function."
    );
}
