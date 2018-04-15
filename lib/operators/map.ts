import {ArgumentInvalidTypeError, ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {Map1Parser, Map2Parser, Map3Parser, Map4Parser, MapParserBase} from "./impls/MapParser";

/**
 * An operator that projects the result of 1 parser to a new value using a selector.
 * @param {(s1: T1) => TResult} selector
 *      A function that produces a new result from the mapped parser.
 * @returns {(parser: Parser<TToken, T1>) => Parser<TToken, TResult>}
 *      Returns a function that projects the result of a warped parser.
 */
export function map<TToken, T1, TResult>(
    selector: (s1: T1) => TResult
): (parser: Parser<TToken, T1>) => Parser<TToken, TResult>;
/**
 * An operator that projects the result of 2 parsers to a new value using a selector.
 * @param {Parser<TToken, T2>} parser2
 *      The parser that will provide the second value to the selector.
 * @param {(s1: T1, s2: T2) => TResult} selector
 *      A function that produces a new result from the mapped parsers.
 * @returns {(parser: Parser<TToken, T1>) => Parser<TToken, TResult>}
 *      Returns a function that projects the result of a warped parser and 1 additional parser.
 */
export function map<TToken, T1, T2, TResult>(
    parser2: Parser<TToken, T2>,
    selector: (s1: T1, s2: T2) => TResult
): (parser: Parser<TToken, T1>) => Parser<TToken, TResult>;
/**
 * An operator that projects the result of 3 parsers to a new value using a selector.
 * @param {Parser<TToken, T2>} parser2
 *      The parser that will provide the second value to the selector.
 * @param {Parser<TToken, T3>} parser3
 *      The parser that will provide the third value to the selector.
 * @param {(s1: T1, s2: T2, s3: T3) => TResult} selector
 *      A function that produces a new result from the mapped parsers.
 * @returns {(parser: Parser<TToken, T1>) => Parser<TToken, TResult>}
 *      Returns a function that projects the result of a warped parser and 2 additional parser.
 */
export function map<TToken, T1, T2, T3, TResult>(
    parser2: Parser<TToken, T2>,
    parser3: Parser<TToken, T3>,
    selector: (s1: T1, s2: T2, s3: T3) => TResult
): (parser: Parser<TToken, T1>) => Parser<TToken, TResult>;
/**
 * An operator that projects the result of 4 parsers to a new value using a selector.
 * @param {Parser<TToken, T2>} parser2
 *      The parser that will provide the second value to the selector.
 * @param {Parser<TToken, T3>} parser3
 *      The parser that will provide the third value to the selector.
 * @param {Parser<TToken, T4>} parser4
 *      The parser that will provide the fourth value to the selector.
 * @param {(s1: T1, s2: T2, s3: T3, s4: T4) => TResult} selector
 *      A function that produces a new result from the mapped parsers.
 * @returns {(parser: Parser<TToken, T1>) => Parser<TToken, TResult>}
 *      Returns a function that projects the result of a warped parser and 3 additional parser.
 */
export function map<TToken, T1, T2, T3, T4, TResult>(
    parser2: Parser<TToken, T2>,
    parser3: Parser<TToken, T3>,
    parser4: Parser<TToken, T4>,
    selector: (s1: T1, s2: T2, s3: T3, s4: T4) => TResult
): (parser: Parser<TToken, T1>) => Parser<TToken, TResult>;
export function map<TToken, T1, T2, T3, T4, TResult>(
    ...args: any[]
): (parser: Parser<TToken, T1>) => Parser<TToken, TResult> {
    if (args.length === 0) {
        throw new ArgumentNullDslError("selector");
    }

    const selectorCandidate = args[args.length - 1];
    const selector = typeof selectorCandidate === "function"
        ? selectorCandidate
        : null;

    if (!selector) {
        throw new ArgumentInvalidTypeError("selector", "(s1: T1, s2: T2, ..., sN: TN) => TResult");
    }

    const parser2 = args.length >= 2
        ? args[0]
        : null;

    if (!parser2) {
        return function mapInternal(parser: Parser<TToken, T1>): Parser<TToken, TResult> {
            if (!parser) {
                throw new ArgumentNullDslError("parser");
            }

            // Static analysis is wrong here. Map1Parser and others from MapParser.ts extends
            // MapParserBase so this is indeed valid code.
            // noinspection SuspiciousInstanceOfGuard
            return parser instanceof MapParserBase
                ? (parser as MapParserBase<TToken, T1>).wrap(selector)
                : new Map1Parser<TToken, T1, TResult>(selector, parser);
        };
    }

    const parser3 = args.length >= 3
        ? args[1]
        : null;

    if (!parser3) {
        return function mapInternal(parser: Parser<TToken, T1>): Parser<TToken, TResult> {
            if (!parser) {
                throw new ArgumentNullDslError("parser");
            }

            return new Map2Parser<TToken, T1, T2, TResult>(selector, parser, parser2);
        };
    }

    const parser4 = args.length >= 4
        ? args[2]
        : null;

    if (!parser4) {
        return function mapInternal(parser: Parser<TToken, T1>): Parser<TToken, TResult> {
            if (!parser) {
                throw new ArgumentNullDslError("parser");
            }

            return new Map3Parser<TToken, T1, T2, T3, TResult>(selector, parser, parser2, parser3);
        };
    }

    return function mapInternal(parser: Parser<TToken, T1>): Parser<TToken, TResult> {
        if (!parser) {
            throw new ArgumentNullDslError("parser");
        }

        return new Map4Parser<TToken, T1, T2, T3, T4, TResult>(selector, parser, parser2, parser3, parser4);
    };
}
