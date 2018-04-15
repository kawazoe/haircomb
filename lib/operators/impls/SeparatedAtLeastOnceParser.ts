import {ReentryError} from "../../exceptions";
import {Fail, InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";
import {then} from "../then";

/**
 * An operator that alternates between a value parser and a separator parser until no
 * more separated values can be found.
 */
export class SeparatedAtLeastOnceParser<TToken, T, TSeparation> extends Parser<TToken, T[]> {
    private remainderParser: Parser<TToken, T>;

    /**
     * Creates an instance of a parser that executes a parent parser and a
     * separator parser in sequence until it fails to find more values and
     * separator pairs. If the failure did not consume an input, the
     * parser succeeds with the buffered results.
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
        separator: Parser<TToken, TSeparation>
    ) {
        super(parser.expected);

        this.remainderParser = then(parser)(separator);
    }

    public parse(state: IParseState<TToken>): InternalResult<T[]> {
        const result = this.parser.parse(state);

        if (!(result instanceof SuccessfulInternalResult)) {
            // state.error has already been set by this.parser
            return Fail(result.hasConsumedInput);
        }

        return this.rest(state, [ result.value ], result.hasConsumedInput);
    }

    private rest(state: IParseState<TToken>, results: T[], hasConsumedInput: boolean): InternalResult<T[]> {
        let result = this.remainderParser.parse(state);

        while (result instanceof SuccessfulInternalResult) {
            if (!result.hasConsumedInput) {
                throw new ReentryError(SeparatedAtLeastOnceParser.name, this.parser.constructor.name);
            }

            hasConsumedInput = true;
            results.push(result.value);
            result = this.remainderParser.parse(state);
        }

        return result.hasConsumedInput
            ? Fail(true)            // < The most recent parser failed after consuming input
            : Succeed(results, hasConsumedInput);
    }
}
