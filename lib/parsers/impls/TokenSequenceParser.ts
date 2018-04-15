import {ExpectedTokenSequence} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that expects a collection of tokens from an input state.
 *
 * This parser is a performance optimization over a ParserSequenceParser of
 * a collection of TokenParser.
 */
export class TokenSequenceParser<TToken> extends Parser<TToken, TToken[]> {
    /**
     * Creates a new instance of a parser that takes a collection of tokens
     * and expect them to appear in the input state.
     * @param {TToken[]} tokens
     *      The collection of tokens to expect.
     * @template TToken
     *      The type of token to parse and of values to return.
     */
    public constructor(
        private tokens: TToken[]
    ) {
        super([ new ExpectedTokenSequence(tokens)]);
    }

    public parse(state: IParseState<TToken>): InternalResult<TToken[]> {
        let hasConsumedInput = false;

        for (const current of this.tokens) {
            const value = state.peek();

            if (!value) {
                return this.failEof(state, value, hasConsumedInput);
            }

            if (value !== current) {
                return this.failToken(state, value, hasConsumedInput);
            }

            hasConsumedInput = true;
            state.advance();
        }

        return Succeed(this.tokens, hasConsumedInput);
    }
}
