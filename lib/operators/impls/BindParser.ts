import {Fail, InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that selects and executes a parser based on the result of a parent parser.
 */
export class BindParser<TToken, T, TNext, TResult> extends Parser<TToken, T> {
    /**
     * Creates a new instance of an operator that selects the next parser to execute
     * based on the result of a parent parser. The resulting value can then be combined
     * with a given selector.
     * @param {Parser<TToken, T>} parser
     *      The parent parser to use as value source.
     * @param {(value: T) => Parser<TToken, TNext>} binder
     *      A function that returns the next parser to execute based on the previous value.
     * @param {(value: T, next: TNext) => TResult} combinator
     *      A function that combines the previous value and the new value to produce the final result.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the input parser returns.
     * @template TNext
     *      The type of result that parers returned by the the binder are expected to return.
     * @template TResult
     *      The type of result that the combinator function, and thus this parser, returns.
     */
    public constructor(
        private parser: Parser<TToken, T>,
        private binder: (value: T) => Parser<TToken, TNext>,
        private combinator: (value: T, next: TNext) => TResult
    ) {
        super(parser.expected);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const result = this.parser.parse(state);

        if (!(result instanceof SuccessfulInternalResult)) {
            // state.error is already set by the parser
            return Fail(result.hasConsumedInput);
        }

        const nextParser = this.binder(result.value);
        const nextResult = nextParser.parse(state);

        const hasConsumedInput = result.hasConsumedInput || nextResult.hasConsumedInput;

        if (!(nextResult instanceof SuccessfulInternalResult)) {
            // state.error is already set by the nextParser
            return Fail(hasConsumedInput);
        }

        return Succeed(
            this.combinator(
                result.value,
                nextResult.value
            ),
            hasConsumedInput
        );
    }
}
