import {Expected, ExpectedParser} from "./expected";
import {Maybe, Nothing} from "./maybe";
import {SourcePosition} from "./SourcePosition";

/**
 * An error in the parsing process.
 */
export interface IError<TToken> {
    /**
     * The detailed cause of the error.
     */
    readonly cause: ErrorCause<TToken>;

    /**
     * An expected value that would have prevented the error.
     */
    readonly expected: Array<Expected<TToken>>;

    /**
     * A message describing the error state.
     */
    readonly message: string;

    /**
     * Clones the current error and returns a new error including the provided
     * values as part of the list of expected values in the error.
     * @param {Array<Expected<TToken>>} expected
     *      Additional expected values to include in the error.
     * @returns {IError<TToken>}
     *      Returns a clone of the error including the additional expected values.
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    withExpected(expected: Array<Expected<TToken>>): IError<TToken>;
}

/**
 * Returns whether a type implements the IError<TToken> interface.
 * @param value
 *      A potential instance of IError<TToken> to check.
 * @returns {boolean} value is IError<TToken>
 *      Returns true if the value is an IError<TToken>, false otherwise.
 * @template TToken
 *      The type of token that the parser was expecting.
 */
export function isError<TToken>(value: any): value is IError<TToken> {
    return !!(value.cause && value.expected);
}

/**
 * A detailed cause for an error.
 */
export class ErrorCause<TToken> {
    /**
     * Creates a new instance of an {ErrorCause<TToken>}.
     * @param {Maybe<TToken>} unexpected
     *      An optional unexpected value that triggered the error.
     * @param {SourcePosition} position
     *      The position in the source stream of tokens that triggered the error.
     * @param {boolean} isEof
     *      An indicator telling if the error happened because the stream ended early.
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    public constructor(
        public readonly unexpected: Maybe<TToken>,
        public readonly position: SourcePosition,
        public readonly isEof: boolean = false
    ) {}
}

/**
 * An error happening during the process of parsing a stream of tokens.
 */
export class ParseError<TToken> implements IError<TToken> {
    /**
     * Creates a new instance of a {ParseError<TToken>}.
     * @param {ErrorCause<TToken>} cause
     *      The cause of the error.
     * @param {Array<Expected<TToken>>} expected
     *      An expected value that could have prevented the error.
     * @param {string} message
     *      A message that describes the error.
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    public constructor(
        public readonly cause: ErrorCause<TToken>,
        public readonly expected: Array<Expected<TToken>>,
        public readonly message: string
    ) {}

    /**
     * Clones the current error and returns a new error including the provided
     * values as part of the list of expected values in the error.
     * @param {Array<Expected<TToken>>} expected
     *      Additional expected values to include in the error.
     * @returns {IError<TToken>}
     *      Returns a clone of the error including the additional expected values.
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    public withExpected(expected: Array<Expected<TToken>>): IError<TToken> {
        return new ParseError<TToken>(
            this.cause,
            expected,
            this.message
        );
    }

    /**
     * Renders the error as a prettified string describing the error.
     * @returns {string}
     */
    public toString(): string {
        let indentCount = 1;
        const autoIndent = () => new Array(indentCount).join("    ");

        let str = "Parse error.";

        if (this.message) {
            str += "\n" + autoIndent() + this.message;
        }

        if (this.cause.isEof || this.cause.unexpected) {
            str += "\n" + autoIndent() + "Unexpected: " + (this.cause.isEof ? "EOF" : "\"" + this.cause.unexpected + "\"");
        }

        const expected = this.expected.filter(e => !!e);

        if (expected && expected.length) {
            str += "\n" + autoIndent() + "Expected:";

            let renderExpect: (exs: Array<Expected<any>>) => void;
            renderExpect = (exs: Array<Expected<any>>) => {
                ++indentCount;

                for (const expect of exs) {
                    str += "\n" + autoIndent() + "<" + expect + ">";

                    if (expect instanceof ExpectedParser && expect.expected.length !== 0) {
                        str += "\n" + autoIndent() + "Due to: ";

                        renderExpect(expect.expected);
                    }
                }

                --indentCount;
            };

            renderExpect(expected);
        }

        str += "\n" + autoIndent() + "at line " + this.cause.position.line + ", column " + this.cause.position.column;

        return str;
    }
}

/**
 * An error used as a default error to return in case a critical failure happens preventing the
 * parsing process to run.
 */
export class UnknownError<TToken> implements IError<TToken> {
    /**
     * A placeholder cause indicating that no parsing has taken place.
     * @type {ErrorCause<TToken>}
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    public readonly cause = new ErrorCause<TToken>(Nothing(), new SourcePosition(0, 0));

    /**
     * An empty list of expected values as no token in the input stream would have prevented this error.
     * @type {Array<Expected<TToken>>}
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    public readonly expected = [] as Array<Expected<TToken>>;

    /**
     * A generic error message describing the error.
     * @type {string}
     */
    public readonly message = "Unknown error";

    /**
     * Fails silently returning the current error without additional details.
     * @returns {IError<TToken>}
     *      Returns the current error.
     * @template TToken
     *      The type of token that the parser was expecting.
     */
    public withExpected(): IError<TToken> {
        return this;
    }

    /**
     * Renders the error as a prettified string describing the error.
     * @returns {string}
     */
    public toString(): string {
        return "Unknown error.";
    }
}
