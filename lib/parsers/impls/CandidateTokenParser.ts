import {ExpectedParser} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that expects a token that matches a given predicate.
 */
export class CandidateTokenParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that succeeds when a given predicate returns true.
     * @param {(value: TToken) => boolean} predicate
     *      A predicate that takes a token from the input state and returns true if the
     *      parser should succeed for this token.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private readonly predicate: (value: TToken) => boolean
    ) {
        super([ new ExpectedParser(predicate.toString(), []) ]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        const value = state.peek();

        if (!value) {
            return this.failEof(state, value);
        }

        if (!this.predicate(value)) {
            return this.failToken(state, value);
        }

        state.advance();
        return Succeed(value, true);
    }
}
