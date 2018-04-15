import {ExpectedNoInput} from "../../expected";
import {InternalResult} from "../../internalResult";
import {Nothing} from "../../maybe";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that always fails.
 */
export class FailParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that always fails with a given
     * error message.
     * @param {string} message
     *      The message to include in the error.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        private readonly message: string
    ) {
        super([ new ExpectedNoInput() ]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        return this.fail(state, Nothing(), this.message);
    }
}
