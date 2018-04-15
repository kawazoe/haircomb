import {concatExpected, Expected} from "../../expected";
import {InternalResult, Succeed, SuccessfulInternalResult} from "../../internalResult";
import {Parser} from "../../Parser";
import {IParseState} from "../../parseStates/IParseState";

/**
 * A base class for all parsers that maps the results of a collection of parsers.
 */
export abstract class MapParserBase<TToken, TResult> extends Parser<TToken, TResult> {
    /**
     * Creates a new instance of a parser that combines the results of multiple other parsers.
     * @param {Array<Expected<TToken>>} expected
     *      A collection of expected values from the various parsers.
     * @template TToken
     *      The type of token to parse.
     * @template TResult
     *      The type of result that the parser returns.
     */
    protected constructor(
        expected: Array<Expected<TToken>>
    ) {
        super(expected);
    }

    /**
     * Creates a new instance of a parser that will wrap this parser with an additional selector.
     * @param {(source: TResult) => TTarget} selector
     *      The selector to use to project the results of this parser's selector.
     * @returns {MapParserBase<TToken, TTarget>}
     *      Returns a new parsers that maps the results of this parser with the provided selector.
     * @template TToken
     *      The type of token to parse.
     */
    public abstract wrap<TTarget>(selector: (source: TResult) => TTarget): MapParserBase<TToken, TTarget>;
}

/**
 * An operator that projects the result of 1 parser to a new value using a selector.
 */
export class Map1Parser<TToken, T1, TResult> extends MapParserBase<TToken, TResult> {
    /**
     * Creates a new parser that uses a given selector to combine the results of 1 other
     * parser into a new result.
     * @param {(source1: T1) => TResult} selector
     *      A function that produces a new result from the mapped parsers.
     * @param {Parser<TToken, T1>} parser1
     *      The parser that will provide the first value to the selector.
     * @template TToken
     *      The type of token to parse.
     * @template T1
     *      The type of result that the parser1 returns.
     * @template TResult
     *      The type of result that the selector function, and thus this parser, returns.
     */
    public constructor(
        private selector: (source1: T1) => TResult,
        private parser1: Parser<TToken, T1>
    ) {
        super(concatExpected([parser1.expected]));
    }

    public wrap<TTarget>(selector: (source: TResult) => TTarget): MapParserBase<TToken, TTarget> {
        return new Map1Parser<TToken, T1, TTarget>(
            s1 => selector(this.selector(s1)),
            this.parser1
        );
    }

    public parse(state: IParseState<TToken>): InternalResult<TResult> {
        let hasConsumedInput = false;

        const result1 = this.parser1.parse(state);
        hasConsumedInput = hasConsumedInput || result1.hasConsumedInput;
        if (!(result1 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        return Succeed(
            this.selector(
                result1.value
            ),
            hasConsumedInput
        );
    }
}

/**
 * An operator that projects the result of 2 parsers to a new value using a selector.
 */
export class Map2Parser<TToken, T1, T2, TResult> extends MapParserBase<TToken, TResult> {
    /**
     * Creates a new parser that uses a given selector to combine the results of 2 other
     * parsers into a new result.
     * @param {(source1: T1, source2: T2) => TResult} selector
     *      A function that produces a new result from the mapped parsers.
     * @param {Parser<TToken, T1>} parser1
     *      The parser that will provide the first value to the selector.
     * @param {Parser<TToken, T2>} parser2
     *      The parser that will provide the second value to the selector.
     * @template TToken
     *      The type of token to parse.
     * @template T1
     *      The type of result that the parser1 returns.
     * @template T2
     *      The type of result that the parser2 returns.
     * @template TResult
     *      The type of result that the selector function, and thus this parser, returns.
     */
    public constructor(
        private selector: (source1: T1, source2: T2) => TResult,
        private parser1: Parser<TToken, T1>,
        private parser2: Parser<TToken, T2>
    ) {
        super(concatExpected([parser1.expected, parser2.expected]));
    }

    public wrap<TTarget>(selector: (source: TResult) => TTarget): MapParserBase<TToken, TTarget> {
        return new Map2Parser<TToken, T1, T2, TTarget>(
            (s1, s2) => selector(this.selector(s1, s2)),
            this.parser1,
            this.parser2
        );
    }

    public parse(state: IParseState<TToken>): InternalResult<TResult> {
        let hasConsumedInput = false;

        const result1 = this.parser1.parse(state);
        hasConsumedInput = hasConsumedInput || result1.hasConsumedInput;
        if (!(result1 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        const result2 = this.parser2.parse(state);
        hasConsumedInput = hasConsumedInput || result2.hasConsumedInput;
        if (!(result2 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        return Succeed(
            this.selector(
                result1.value,
                result2.value
            ),
            hasConsumedInput
        );
    }
}

/**
 * An operator that projects the result of 3 parsers to a new value using a selector.
 */
export class Map3Parser<TToken, T1, T2, T3, TResult> extends MapParserBase<TToken, TResult> {
    /**
     * Creates a new parser that uses a given selector to combine the results of 3 other
     * parsers into a new result.
     * @param {(source1: T1, source2: T2, source3: T3) => TResult} selector
     *      A function that produces a new result from the mapped parsers.
     * @param {Parser<TToken, T1>} parser1
     *      The parser that will provide the first value to the selector.
     * @param {Parser<TToken, T2>} parser2
     *      The parser that will provide the second value to the selector.
     * @param {Parser<TToken, T3>} parser3
     *      The parser that will provide the third value to the selector.
     * @template TToken
     *      The type of token to parse.
     * @template T1
     *      The type of result that the parser1 returns.
     * @template T2
     *      The type of result that the parser2 returns.
     * @template T3
     *      The type of result that the parser3 returns.
     * @template TResult
     *      The type of result that the selector function, and thus this parser, returns.
     */
    public constructor(
        private selector: (source1: T1, source2: T2, source3: T3) => TResult,
        private parser1: Parser<TToken, T1>,
        private parser2: Parser<TToken, T2>,
        private parser3: Parser<TToken, T3>
    ) {
        super(concatExpected([parser1.expected, parser2.expected, parser3.expected]));
    }

    public wrap<TTarget>(selector: (source: TResult) => TTarget): MapParserBase<TToken, TTarget> {
        return new Map3Parser<TToken, T1, T2, T3, TTarget>(
            (s1, s2, s3) => selector(this.selector(s1, s2, s3)),
            this.parser1,
            this.parser2,
            this.parser3
        );
    }

    public parse(state: IParseState<TToken>): InternalResult<TResult> {
        let hasConsumedInput = false;

        const result1 = this.parser1.parse(state);
        hasConsumedInput = hasConsumedInput || result1.hasConsumedInput;
        if (!(result1 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        const result2 = this.parser2.parse(state);
        hasConsumedInput = hasConsumedInput || result2.hasConsumedInput;
        if (!(result2 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        const result3 = this.parser3.parse(state);
        hasConsumedInput = hasConsumedInput || result3.hasConsumedInput;
        if (!(result3 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        return Succeed(
            this.selector(
                result1.value,
                result2.value,
                result3.value
            ),
            hasConsumedInput
        );
    }
}

/**
 * An operator that projects the result of 4 parsers to a new value using a selector.
 */
export class Map4Parser<TToken, T1, T2, T3, T4, TResult> extends MapParserBase<TToken, TResult> {
    /**
     * Creates a new parser that uses a given selector to combine the results of 4 other
     * parsers into a new result.
     * @param {(source1: T1, source2: T2, source3: T3, source4: T4) => TResult} selector
     *      A function that produces a new result from the mapped parsers.
     * @param {Parser<TToken, T1>} parser1
     *      The parser that will provide the first value to the selector.
     * @param {Parser<TToken, T2>} parser2
     *      The parser that will provide the second value to the selector.
     * @param {Parser<TToken, T3>} parser3
     *      The parser that will provide the third value to the selector.
     * @param {Parser<TToken, T4>} parser4
     *      The parser that will provide the fourth value to the selector.
     * @template TToken
     *      The type of token to parse.
     * @template T1
     *      The type of result that the parser1 returns.
     * @template T2
     *      The type of result that the parser2 returns.
     * @template T3
     *      The type of result that the parser3 returns.
     * @template T4
     *      The type of result that the parser4 returns.
     * @template TResult
     *      The type of result that the selector function, and thus this parser, returns.
     */
    public constructor(
        private selector: (source1: T1, source2: T2, source3: T3, source4: T4) => TResult,
        private parser1: Parser<TToken, T1>,
        private parser2: Parser<TToken, T2>,
        private parser3: Parser<TToken, T3>,
        private parser4: Parser<TToken, T4>
    ) {
        super(concatExpected([parser1.expected, parser2.expected, parser3.expected, parser4.expected]));
    }

    public wrap<TTarget>(selector: (source: TResult) => TTarget): MapParserBase<TToken, TTarget> {
        return new Map4Parser<TToken, T1, T2, T3, T4, TTarget>(
            (s1, s2, s3, s4) => selector(this.selector(s1, s2, s3, s4)),
            this.parser1,
            this.parser2,
            this.parser3,
            this.parser4
        );
    }

    public parse(state: IParseState<TToken>): InternalResult<TResult> {
        let hasConsumedInput = false;

        const result1 = this.parser1.parse(state);
        hasConsumedInput = hasConsumedInput || result1.hasConsumedInput;
        if (!(result1 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        const result2 = this.parser2.parse(state);
        hasConsumedInput = hasConsumedInput || result2.hasConsumedInput;
        if (!(result2 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        const result3 = this.parser3.parse(state);
        hasConsumedInput = hasConsumedInput || result3.hasConsumedInput;
        if (!(result3 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        const result4 = this.parser4.parse(state);
        hasConsumedInput = hasConsumedInput || result4.hasConsumedInput;
        if (!(result4 instanceof SuccessfulInternalResult)) {
            return this.forwardFailWithExpected(state, hasConsumedInput);
        }

        return Succeed(
            this.selector(
                result1.value,
                result2.value,
                result3.value,
                result4.value
            ),
            hasConsumedInput
        );
    }
}
