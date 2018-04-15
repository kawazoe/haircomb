import {InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * An operator that that peeks at the result of a parent parser
 * without consuming any input.
 */
export class LookaheadParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that executes a parent parser and rewinds the
     * state back to its previous value, effectively peeking at the result of a parser
     * without consuming any inputs.
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

        if (result instanceof SuccessfulInternalResult) {
            state.rewind();
            return Succeed(result.value);
        }

        state.popBookmark();
        return result;
    }
}
