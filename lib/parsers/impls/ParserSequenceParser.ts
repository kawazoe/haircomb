import {concatExpected} from "../../expected";
import {InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that executes a collection of parsers in order until either completion or one fails.
 */
export class ParserSequenceParser<TToken, T> extends Parser<TToken, T[]> {
    /**
     * Creates a new instance of a parser that executes a collection of parsers, buffering their
     * results and returning the buffer on completion, or returning the error of the first
     * failing parser.
     * @param {Array<Parser<TToken, T>>} parsers
     *      The list of parsers to execute.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private parsers: Array<Parser<TToken, T>>
    ) {
        super(concatExpected(parsers.map(p => p.expected)));
    }

    public parse(state: IParseState<TToken>): InternalResult<T[]> {
        let hasConsumedInput = false;
        const results = [];

        for (const current of this.parsers) {
            const result = current.parse(state);
            hasConsumedInput = hasConsumedInput || result.hasConsumedInput;

            if (!(result instanceof SuccessfulInternalResult)) {
                return this.forwardFailWithExpected(state, hasConsumedInput);
            }

            results.push(result.value);
        }

        return Succeed(results, hasConsumedInput);
    }
}
