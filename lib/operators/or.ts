import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {oneOf} from "../parsers/oneOf";

export function or<TToken, T>(
    parser2: Parser<TToken, T>
): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    if (!parser2) {
        throw new ArgumentNullDslError("parser2");
    }

    return function orInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return oneOf(parser, parser2);
    };
}
