import {ExpectedParser} from "../../expected";
import {Fail, InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {ErrorCause, ParseError} from "../../parseError";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that inverse the expectation of an other parser.
 */
export class NegatedParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates an instance of a parser that will succeed with a unit value
     * when the parent parser fails and fails when it succeeds.
     * @param {Parser<TToken, T>} parser
     *      The parser to negate.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private parser: Parser<TToken, T>
    ) {
        super([ new ExpectedParser<TToken>("Not...", parser.expected), parser.expected ]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const startingPosition = state.sourcePos;
        const token = state.peek();
        const result = this.parser.parse(state);

        if (result instanceof SuccessfulInternalResult) {
            state.error = new ParseError<TToken>(
                new ErrorCause<TToken>(
                    token,
                    startingPosition
                ),
                this.expected.concat(state.error.expected),
                `Expected not <${state.error.message}>`
            );
            return Fail(result.hasConsumedInput);
        }

        return Succeed(undefined as any, result.hasConsumedInput);
    }
}
