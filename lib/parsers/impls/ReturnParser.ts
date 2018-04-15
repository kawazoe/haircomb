import {ExpectedNoInput} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";

/**
 * A parser that always succeeds with a given value.
 */
export class ReturnParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that succeeds, returning a given
     * input value, completely ignoring its input state.
     * @param {T} value
     *      The value that this parser should return.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        public readonly value: T
    ) {
        super([ new ExpectedNoInput() ]);
    }

    public parse(): InternalResult<T> {
        return Succeed(this.value);
    }
}
