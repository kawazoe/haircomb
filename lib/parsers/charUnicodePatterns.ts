import {Char} from "../Char";
import {labelled} from "../operators/labelled";
import {many} from "../operators/many";
import {manyString} from "../operators/manyString";
import {pipe} from "../operators/pipe";
import {skipMany} from "../operators/skipMany";
import {Parser} from "../Parser";
import {candidate} from "./candidate";

// Uses XRegExp if the installed globally.
// This pattern means that we do not have to impose the users of this package
// to use XRegExp if their target environment supports unicode regexps already.
// This also means that we can dodge various compatibility issues when using
// the current version (4.1.1) together with types (for v3.x) and rollup (0.60)
// that will hopefully be fixed when XRegExp moves over to rollup:
// https://github.com/slevithan/xregexp/pull/243
declare var XRegExp: (pattern: string) => { test: (value: string) => boolean };
function createRegExp(pattern: string) {
    if (typeof XRegExp !== "undefined") {
        return XRegExp(pattern);
    }

    return new RegExp(pattern, "u");
}

// See https://github.com/tc39/proposal-regexp-unicode-property-escapes/blob/master/table-unicode-general-category-values.html
const digitUnicodeRegex = createRegExp("^\\p{Nd}$");
const lowercaseUnicodeRegex = createRegExp("^\\p{Lower}$");
const uppercaseUnicodeRegex = createRegExp("^\\p{Upper}$");
const letterUnicodeRegex = createRegExp("^\\p{L}$");
const letterOrDigitUnicodeRegex = createRegExp("^[\\p{L}\\p{Nd}]$");
const symbolUnicodeRegex = createRegExp("^\\p{S}$");
const separatorUnicodeRegex = createRegExp("^[^\\p{Z}]$");
const punctuationUnicodeRegex = createRegExp("^\\p{P}$");

const whitespaceUnicodeRegex = createRegExp("^\\p{Zs}$");

/**
 * A parser that expects unicode digits from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_DIGIT: Parser<Char, Char> = labelled("unicode digit")(candidate<Char, Char>(c => digitUnicodeRegex.test(c)));

/**
 * A parser that expects unicode lowercase characters from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_LOWERCASE: Parser<Char, Char> = labelled("unicode lowercase letter")(candidate<Char, Char>(c => lowercaseUnicodeRegex.test(c)));

/**
 * A parser that expects unicode uppercase characters from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_UPPERCASE: Parser<Char, Char> = labelled("unicode uppercase letter")(candidate<Char, Char>(c => uppercaseUnicodeRegex.test(c)));

/**
 * A parser that expects unicode letters from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_LETTER: Parser<Char, Char> = labelled("unicode letter")(candidate<Char, Char>(c => letterUnicodeRegex.test(c)));

/**
 * A parser that expects unicode letters or digits from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_LETTERORDIGIT: Parser<Char, Char> = labelled("unicode letter or digit")(candidate<Char, Char>(c => letterOrDigitUnicodeRegex.test(c)));

/**
 * A parser that expects unicode symbols from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_SYMBOL: Parser<Char, Char> = labelled("unicode symbol")(candidate<Char, Char>(c => symbolUnicodeRegex.test(c)));

/**
 * A parser that expects unicode separators from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_SEPARATOR: Parser<Char, Char> = labelled("unicode separator")(candidate<Char, Char>(c => separatorUnicodeRegex.test(c)));

/**
 * A parser that expects unicode punctuation marks from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_PUNCTUATION: Parser<Char, Char> = labelled("unicode punctuation")(candidate<Char, Char>(c => punctuationUnicodeRegex.test(c)));

/**
 * A parser that expects unicode whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_WHITESPACE: Parser<Char, Char> = labelled("unicode whitespace")(candidate<Char, Char>(c => whitespaceUnicodeRegex.test(c)));

/**
 * A parser that expects multiple unicode whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_WHITESPACES: Parser<Char, Char> = pipe(
    many(),
    labelled("unicode whitespaces")
)(candidate<Char, Char>(c => whitespaceUnicodeRegex.test(c)));

/**
 * A parser that expects multiple buffered unicode whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_WHITESPACE_STRING: Parser<Char, string> = pipe(
    manyString(),
    labelled("unicode whitespaces")
)(candidate<Char, Char>(c => whitespaceUnicodeRegex.test(c)));

/**
 * A parser that skips multiple unicode whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const UNICODE_SKIP_WHITESPACES: Parser<Char, undefined> = pipe(
    skipMany(),
    labelled("skip unicode whitespaces")
)(candidate<Char, Char>(c => whitespaceUnicodeRegex.test(c)));
