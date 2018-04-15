import {ExpectedEof} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that expects the end of the input state.
 */
export class EndParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that succeeds when there are no longer
     * any tokens in the input state.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor() {
        super([new ExpectedEof()]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const value = state.peek();

        if (value) {
            return this.fail(state, value, "Expected the state to have ended but found more content.");
        }

        return Succeed(undefined as any);
    }
}
