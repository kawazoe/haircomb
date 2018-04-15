import {Char} from "../../Char";
import {ExpectedTokenSequence} from "../../expected";
import {InternalResult, Succeed} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A parser that parse an expected string in a case-insensitive manner.
 *
 * This parser is a performance optimisation over a ParserSequenceParser of
 * a collection of CandidateTokenParser checking for a series of CHar tokens in
 * a case-insensitive manner.
 */
export class StringCaseInsensitiveParser extends Parser<Char, string> {
    private readonly tokens: Char[];

    /**
     * Creates a new instance of a parser that expects to find a given string,
     * ignoring casing, in its input state.
     *
     * This parser will return the actual input state rather than the expected
     * string. This means that the input case, and not the expected case, is
     * preserved.
     * @param {string} tokens
     *      The expected string.
     */
    public constructor(
        tokens: string
    ) {
        const vl = Array.from(tokens.toLowerCase());
        const vu = Array.from(tokens.toUpperCase());

        super([ new ExpectedTokenSequence<Char>(vl), new ExpectedTokenSequence<Char>(vu) ]);

        this.tokens = vl;
    }

    public parse(state: IParseState<Char>): InternalResult<string> {
        let hasConsumedInput = false;

        const builder = [] as Char[];

        for (const char of this.tokens) {
            const value = state.peek();

            if (!value) {
                return this.failEof(state, value, hasConsumedInput);
            }

            if (char.toLowerCase() !== char) {
                return this.failToken(state, char, hasConsumedInput);
            }

            hasConsumedInput = true;
            builder.push(value);
            state.advance();
        }

        return Succeed(builder.join(""), hasConsumedInput);
    }
}
