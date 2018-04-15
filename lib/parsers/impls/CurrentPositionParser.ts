import {ExpectedNoInput} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that returns the current position in the state.
 */
export class CurrentPositionParser<TToken, T> extends Parser<TToken, T> {
    /**
     * Creates a new instance of a parser that succeeds with the current position
     * in the input state.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor() {
        super([ new ExpectedNoInput() ]);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        return Succeed(state.sourcePos);
    }
}
