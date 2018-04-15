import {Char} from "./Char";
import {defaultCharPositionCalculator, defaultPositionCalculator} from "./defaultPositionCalculators";
import {SuccessfulInternalResult} from "./internalResult";
import {Parser} from "./Parser";
import {ParseResult} from "./ParseResult";
import {ArrayParseState} from "./parseStates/ArrayParseState";
import {IParseState} from "./parseStates/IParseState";
import {StringParseState} from "./parseStates/StringParseState";
import {SourcePosition} from "./SourcePosition";

/**
 *
 */
export class ParseContext<TToken, T> {
    public constructor(
        private stateFactory: () => IParseState<TToken>
    ) {}

    public with(parser: Parser<TToken, T>): ParseResult<TToken, T> {
        const state = this.stateFactory();

        state.advance();

        const result = parser.parse(state);

        return result instanceof SuccessfulInternalResult
           ? new ParseResult<TToken, T>(result.value, result.hasConsumedInput)
           : new ParseResult<TToken, T>(state.error, result.hasConsumedInput);
    }
}

/**
 * Creates a ParseContext<Char, T> object that will apply a parser chain to the given input
 * using the provided position calculator to keep track of its location within the input string.
 * @param {string} input
 *      An input string to parse.
 * @param {(token: Char, previous: SourcePosition) => SourcePosition} calculatePosition
 *      A function that keeps track of the current position in the input string.
 * @returns {ParseContext<Char, T>}
 *      Returns an object that will apply a parser to the given input.
 */
export function parse<T>(
    input: string,
    calculatePosition?: (token: Char, previous: SourcePosition) => SourcePosition
): ParseContext<Char, T>;
/**
 * Creates a ParseContext<TToken, T> object that will apply a parser chain to the given input
 * using the provided position calculator to keep track of its location within the input token collection.
 * @param {TToken[]} input
 *      An input array of tokens to parse.
 * @param {(token: TToken, previous: SourcePosition) => SourcePosition} calculatePosition
 *      A function that keeps track of the current position in the input array of tokens.
 * @returns {ParseContext<TToken, T>}
 *      Returns an object that will apply a parser to the given input.
 */
export function parse<TToken, T>(
    input: TToken[],
    calculatePosition?: (token: TToken, previous: SourcePosition) => SourcePosition
): ParseContext<TToken, T>;
export function parse<TToken, T>(
    input: string | TToken[],
    calculatePosition?: (token: Char | TToken, previous: SourcePosition) => SourcePosition
): ParseContext<string | TToken, T> {
    if (typeof input === "string") {
        return new ParseContext<Char, T>(
            () => new StringParseState(input, calculatePosition || defaultCharPositionCalculator)
        );
    }

    return new ParseContext<TToken, T>(
        () => new ArrayParseState<TToken>(input, calculatePosition || defaultPositionCalculator)
    );
}
