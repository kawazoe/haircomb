import {ArgumentNullDslError} from "../exceptions";
import {ExpectedParser} from "../expected";
import {Parser} from "../Parser";
import {withExpected} from "./withExpected";

export function labelled<TToken, T>(
    label: string
): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    if (!label) {
        throw new ArgumentNullDslError("label");
    }

    return function labelledInternal(parser: Parser<TToken, T>): Parser<TToken, T> {
        return withExpected([ new ExpectedParser<TToken>(label, parser.expected) ])(parser);
    };
}
