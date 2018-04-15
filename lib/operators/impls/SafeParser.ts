import {Fail, InternalResult, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that peeks at the result of an other parser
 * and does not consumes any input if it fails.
 */
export class SafeParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that executes a parent parser and rewinds the
     * state back to its previous value when it fails, effectively peeking at the result
     * of a parser without consuming any inputs upon failures.
     * @param {Parser<TToken, T>} parser
     *      The parser to peek at.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private parser: Parser<TToken, T>
    ) {
        super(parser.expected);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        state.pushBookmark();

        const result = this.parser.parse(state);

        if (!(result instanceof SuccessfulInternalResult)) {
            state.rewind();
            return Fail();
        }

        state.popBookmark();
        return result;
    }
}
