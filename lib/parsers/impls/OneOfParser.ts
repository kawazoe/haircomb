import {unionExpected} from "../../expected";
import {Fail, InternalResult, SuccessfulInternalResult} from "../../internalResult";
import {Nothing} from "../../maybe";
import {ErrorCause, ParseError} from "../../parseError";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that returns the first successful result of a collection of parsers.
 */
export class OneOfParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that will attempt to parse its input state
     * using a provided collection of parsers, taking the first successful result or
     * the left-most error as its own result.
     * @param {Array<Parser<TToken, T>>} parsers
     *      A collection of parsers that will be used, in order, to attempt to
     *      parse the input state.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private parsers: Array<Parser<TToken, T>>
    ) {
        super(unionExpected(parsers.map(p => p.expected)));
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        let firstTime = true;
        let err = new ParseError<TToken>(
            new ErrorCause<TToken>(
                Nothing(),
                state.sourcePos
            ),
            this.expected,
            "OneOf had no arguments."
        );
        let failureResult = Fail();

        for (const p of this.parsers) {
            const result = p.parse(state);

            // We will usually return the error from the first parser that did not backtrack,
            // even if other parsers had a longer match. There is some room for improvement here.
            if (result instanceof SuccessfulInternalResult || result.hasConsumedInput) {
                return result;
            }

            // Choose the longest match, preferring the left-most error in a tie,
            // except the first time to avoid returning "OneOf had no arguments".
            if (firstTime || state.error.cause.position > err.cause.position) {
                failureResult = result;
                err = state.error;
            }

            firstTime = false;
        }

        state.error = err.withExpected(this.expected);
        return failureResult;
    }
}
