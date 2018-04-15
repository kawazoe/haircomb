import {ExpectedParser} from "../../expected";
import {InternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

function memoize<TResult>(func: () => TResult): () => TResult {
    let result: TResult | undefined;

    return () => result ? result : (result = func());
}

/**
 * A parser that proxies an other parser, postponing its resolution until the execution phase.
 */
export class RecursiveParser<TToken, T> extends Parser<TToken, T> {
    private parserProvider: () => Parser<TToken, T>;

    /**
     * Creates a new instance of a parser that will resolve a parser from the parser provider
     * at execution time and then forward its input state to the freshly resolved parser.
     *
     * The provider function will only be called once, no matter how many time the parse method
     * of this parser is called.
     * @param {() => Parser<TToken, T>} parserProvider
     *      A function that returns the parser to use while parsing the input state.
     * @template TToken
     *      The type of token to parse.
     * @template T
     *      The type of result that the parser returns.
     */
    public constructor(
        parserProvider: () => Parser<TToken, T>
    ) {
        super([new ExpectedParser("Recursive", [])]);

        this.parserProvider = memoize(parserProvider);
    }

    public parse(state: IParseState<TToken>): InternalResult<T> {
        return this.parserProvider().parse(state);
    }
}
