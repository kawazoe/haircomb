import {ExpectedParser} from "../../expected";
import {InternalResult, SuccessfulInternalResult} from "../../internalResult";
import {Nothing} from "../../maybe";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that fails a chain when a predicate is not met.
 */
export class AssertParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that returns a failure result when
     * a given predicate applied on the result of a parent parser returns false.
     * @param {Parser<TToken, T>} parser
     *      The parser providing the source value for the predicate.
     * @param {(value: T) => boolean} predicate
     *      A predicate to evaluate the fitness of the previous parser's result.
     * @param {(value: T) => string} errorMessage
     *      A function that returns an error message to include in the result based on the failed value.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private parser: Parser<TToken, T>,
        private predicate: (value: T) => boolean,
        private errorMessage: (value: T) => string
    ) {
        super([ new ExpectedParser<TToken>("Result satisfying assertion", parser.expected) ]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const result = this.parser.parse(state);

        if (!(result instanceof SuccessfulInternalResult)) {
            return result;
        }

        if (!this.predicate(result.value)) {
            return this.fail(state, Nothing(), this.errorMessage(result.value), result.hasConsumedInput);
        }

        return result;
    }
}
