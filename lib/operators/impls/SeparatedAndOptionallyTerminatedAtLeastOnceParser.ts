import {Fail, InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that alternates between a value parser and a separator parser until one of them fails.
 */
export class SeparatedAndOptionallyTerminatedAtLeastOnceParser<TToken, T, TSeparation> extends Parser<TToken, T[]> {
    /**
     * Creates an instance of a parser that executes a parent parser and an
     * expected separator parser in sequence until one of them fails. If the
     * failure did not consume an input, the parser succeeds with the
     * buffered results.
     * @param {Parser<TToken, T>} parser
     *      The value parser to execute.
     * @param {Parser<TToken, TSeparation>} separator
     *      The separator parser to execute.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the value parser and this parser returns.
     * @template TSeparation
     *      The type of result that the separator parser returns.
     */
    public constructor(
        private parser: Parser<TToken, T>,
        private separator: Parser<TToken, TSeparation>
    ) {
        super(parser.expected);
    }

    public parse(state: IParseState<TToken>): InternalResult<T[]> {
        const result = this.parser.parse(state);

        if (!(result instanceof SuccessfulInternalResult)) {
            // state.error has been set by this.parser
            return Fail(result.hasConsumedInput);
        }

        return this.rest(state, [result.value], result.hasConsumedInput);
    }

    private rest(state: IParseState<TToken>, results: T[], hasConsumedInput: boolean): InternalResult<T[]> {
        while (true) {
            const separatorResult = this.separator.parse(state);
            hasConsumedInput = hasConsumedInput || separatorResult.hasConsumedInput;

            if (!(separatorResult instanceof SuccessfulInternalResult)) {
                return separatorResult.hasConsumedInput
                    ? Fail(hasConsumedInput)
                    : Succeed(results, hasConsumedInput);
            }

            const itemResult = this.parser.parse(state);
            hasConsumedInput = hasConsumedInput || itemResult.hasConsumedInput;

            if (!(itemResult instanceof SuccessfulInternalResult)) {
                return itemResult.hasConsumedInput
                    ? Fail(hasConsumedInput)
                    : Succeed(results, hasConsumedInput);
            }

            results.push(itemResult.value);
        }
    }
}
