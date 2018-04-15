import {ReentryError} from "../../exceptions";
import {Fail, InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that applies a parent parser as many times as it succeeds to build
 * a buffer of results.
 */
export class ChainAtLeastOnceLParser<TToken, T, TNext> extends Parser<TToken, TNext> {
    /**
     * Creates a new instance of a parser that executes a parent parser over and over
     * until it returns a failure result, in which case it returns the accumulated
     * buffer of results built using a combinator function.
     * @param {Parser<TToken, T>} parser
     *      The parent parser to execute until it fails.
     * @param {() => TNext} seed
     *      The initial value of the accumulator used to produce the final result.
     * @param {(accumulator: TNext, value: T) => TNext} combinator
     *      A function that takes an accumulator value and append the current value
     *      to produce a new accumulator.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the input parser returns.
     * @template TNext
     *      The type of result that the combinator function, and thus this parser, returns.
     */
    public constructor(
        private parser: Parser<TToken, T>,
        private seed: () => TNext,
        private combinator: (accumulator: TNext, value: T) => TNext
    ) {
        super(parser.expected);
    }

    public parse(state: IParseState<TToken>): InternalResult<TNext> {
        const previous = this.parser.parse(state);

        if (!(previous instanceof SuccessfulInternalResult)) {
            // state.error is set by the parser
            return Fail(previous.hasConsumedInput);
        }

        let hasConsumedInput = previous.hasConsumedInput;
        let chain = this.combinator(this.seed(), previous.value);

        let current = this.parser.parse(state);
        while (current instanceof SuccessfulInternalResult) {
            if (!current.hasConsumedInput) {
                throw new ReentryError(ChainAtLeastOnceLParser.name, this.parser.constructor.name);
            }

            hasConsumedInput = true;
            chain = this.combinator(chain, current.value);
            current = this.parser.parse(state);
        }

        return current.hasConsumedInput
            ? Fail(true)            // < The most recent parser failed after consuming input
            : Succeed<TNext>(chain, hasConsumedInput);
    }
}
