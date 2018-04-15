import {Parser} from "../Parser";
import {assert} from "./assert";
import {cast} from "./cast";
import {labelled} from "./labelled";
import {pipe} from "./pipe";

export function ofType<TToken, TSource, TResult>(
    sentinel: TResult
): (parser: Parser<TToken, TSource>) => Parser<TToken, TResult> {
    return pipe(
        assert(
            (v: any) => v.constructor.name === sentinel.constructor.name,
            (v: any) => `Expected a ${sentinel.constructor.name} but got a ${v.constructor.name}`
        ),
        cast(sentinel),
        labelled(`Result of type ${sentinel.constructor.name}`)
    );
}
