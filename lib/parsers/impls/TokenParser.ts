import {ExpectedTokenSequence} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that expects a given token from the input state.
 */
export class TokenParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that reads the input state and
     * succeeds when it finds the given token at the current location.
     * @param {TToken} token
     *      The expected token.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private readonly token: TToken
    ) {
        super([ new ExpectedTokenSequence([ token ]) ]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const value = state.peek();

        if (!value) {
            return this.failEof(state, value);
        }

        if (value !== this.token) {
            return this.failToken(state, value);
        }

        state.advance();
        return Succeed(value, true);
    }
}
