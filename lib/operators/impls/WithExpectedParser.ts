import {Expected} from "../../expected";
import {InternalResult, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that extends the collection of expected results in error
 * states propagating through this parser with an additional set of
 * expectations.
 */
export class WithExpectedParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that appends additional
     * expected results to the ones listed in the errors returned
     * from a parent parser.
     * @param {Parser<TToken, T>} parser
     *      The parent parser providing results to extends.
     * @param {Array<Expected<TToken>>} expected
     *      The list of additional expected results to include in error states.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private parser: Parser<TToken, T>,
        expected: Array<Expected<TToken>>
    ) {
        super(expected);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const result = this.parser.parse(state);

        if (!(result instanceof SuccessfulInternalResult)) {
            state.error = state.error.withExpected(this.expected);
        }

        return result;
    }
}
