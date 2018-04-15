import {IError, isError} from "./parseError";

/**
 * The outcome of a parsing operation executed on a chain of {Parser<TToken, T>}.
 */
export class ParseResult<TToken, T> {
    /**
     * Indicates whether the parsing was successful.
     */
    public readonly successful: boolean;

    /**
     * Creates a new instance of a {ParseResult<TToken, T>}.
     * @param {IError<TToken> | T} value
     *      Either the meaningful outcome of parsing an input state,
     *      or an error reported by one or more parsers through the chain.
     * @param {boolean} hasConsumedInput
     *      Indicates whether at least one token has been consumed from the input state.
     */
    public constructor(
        private readonly value: IError<TToken> | T,
        public readonly hasConsumedInput: boolean
    ) {
        this.successful = !isError(value);
    }

    /**
     * Gets the result of the parsing operation assuming it was successful.
     * @returns {T}
     */
    public get result(): T {
        if (!this.successful) {
            throw new Error("Cannot read result of parsing as an error occurred.");
        }

        return this.value as T;
    }

    /**
     * Gets the error that caused the parsing operation to fail assuming it was not successful.
     * @returns {IError<TToken>}
     */
    public get error(): IError<TToken> {
        if (this.successful) {
            throw new Error("Cannot read error of parsing as no error occurred.");
        }

        return this.value as IError<TToken>;
    }
}
