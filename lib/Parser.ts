import {Expected} from "./expected";
import {Fail, InternalResult} from "./internalResult";
import {Maybe} from "./maybe";
import {ErrorCause, ParseError} from "./parseError";
import {IParseState} from "./parseStates/IParseState";

/**
 * A base class providing the low-level infrastructure used by all parsers.
 */
export abstract class Parser<TToken, T> {
    /**
     * Creates a new instance of a {Parser<TToken, T>}.
     * @param {Array<Expected<TToken>>} expected
     *      A collection of expected values for this parser.
     */
    protected constructor(
        public readonly expected: Expected<TToken>[]
    ) {}

    /**
     * The method that will be executed when the parsing process runs on a given parser.
     * @param {IParseState<TToken>} state
     *      A shared state object that flows through all parsers as they execute.
     *
     *      Each parser can consume input from the state, manipulate the current position of
     *      the state via bookmarks, or register an error in the state.
     * @returns {InternalResult<T>}
     *      Returns either a successfully parsed value from the state, or an error value.
     */
    public abstract parse(state: IParseState<TToken>): InternalResult<T>;

    /**
     * A utility method that can be used by parsers to fail with an End of File message.
     * @param {IParseState<TToken>} state
     *      The current state.
     * @param {Maybe<TToken>} unexpected
     *      The unexpected token that triggered the error.
     * @param {boolean} hasConsumedInput
     *      Whether the parser has consumed part of the input or not.
     * @returns {InternalResult<T>}
     *      Returns a failure result after setting up the proper error state.
     */
    protected failEof(
        state: IParseState<TToken>,
        unexpected: Maybe<TToken>,
        hasConsumedInput?: boolean
    ): InternalResult<T> {
        return this.fail(
            state,
            unexpected,
            "Expected the state to have more content but reached the end of the state.",
            hasConsumedInput,
            true
        );
    }

    /**
     * A utility method that can be used by parsers to fail with an unexpected token message.
     * @param {IParseState<TToken>} state
     *      The current state.
     * @param {Maybe<TToken>} unexpected
     *      The unexpected token that triggered the error.
     * @param {boolean} hasConsumedInput
     *      Whether the parser has consumed part of the input or not.
     * @returns {InternalResult<T>}
     *      Returns a failure result after setting up the proper error state.
     */
    protected failToken(
        state: IParseState<TToken>,
        unexpected: Maybe<TToken>,
        hasConsumedInput?: boolean
    ): InternalResult<T> {
        return this.fail(
            state,
            unexpected,
            "Token did not match expected predicate or token list.",
            hasConsumedInput
        );
    }

    /**
     * A utility method that can be used by parsers to fail with a custom message.
     * @param {IParseState<TToken>} state
     *      The current state.
     * @param {Maybe<TToken>} unexpected
     *      The unexpected token that triggered the error.
     * @param message
     *      The message to use in the error.
     * @param {boolean} hasConsumedInput
     *      Whether the parser has consumed part of the input or not.
     * @param isEof
     * @returns {InternalResult<T>}
     *      Returns a failure result after setting up the proper error state.
     */
    protected fail(
        state: IParseState<TToken>,
        unexpected: Maybe<TToken>,
        message: string,
        hasConsumedInput?: boolean,
        isEof?: boolean
    ): InternalResult<T> {
        state.error = new ParseError(
            new ErrorCause(
                unexpected,
                state.sourcePos,
                isEof
            ),
            this.expected,
            message
        );
        return Fail(hasConsumedInput || false);
    }

    /**
     * A utility method that can be used by parsers to fail while augmenting the current
     * error state with this parser's expected value.
     * @param {IParseState<TToken>} state
     *      The current state.
     * @param {boolean} hasConsumedInput
     *      Whether the parser has consumed part of the input or not.
     * @returns {InternalResult<void>}
     *      Returns a failure result after updating the error state.
     */
    protected forwardFailWithExpected(state: IParseState<TToken>, hasConsumedInput?: boolean) {
        state.error = state.error.withExpected(this.expected);
        return Fail(hasConsumedInput);
    }
}
