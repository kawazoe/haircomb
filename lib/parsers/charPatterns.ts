import {Char} from "../Char";
import {labelled} from "../operators/labelled";
import {many} from "../operators/many";
import {manyString} from "../operators/manyString";
import {pipe} from "../operators/pipe";
import {skipMany} from "../operators/skipMany";
import {Parser} from "../Parser";
import {candidate} from "./candidate";

const digitRegex = /^\d$/;
const lowercaseRegex = /^[a-z]$/;
const uppercaseRegex = /^[A-Z]$/;
const letterRegex = /^[a-zA-Z]$/;
const letterOrDigitRegex = /^\w$/;
const symbolRegex = /^[^\w\s]$/;

const whitespaceRegex = /^\s$/;

/**
 * A parser that expects digits from the input state.
 * @type {Parser<any, any>}
 */
export const DIGIT: Parser<Char, Char> = labelled("digit")(candidate<Char, Char>(c => digitRegex.test(c)));

/**
 * A parser that expects lowercase characters from the input state.
 * @type {Parser<any, any>}
 */
export const LOWERCASE: Parser<Char, Char> = labelled("lowercase letter")(candidate<Char, Char>(c => lowercaseRegex.test(c)));

/**
 * A parser that expects uppercase characters from the input state.
 * @type {Parser<any, any>}
 */
export const UPPERCASE: Parser<Char, Char> = labelled("uppercase letter")(candidate<Char, Char>(c => uppercaseRegex.test(c)));

/**
 * A parser that expects letters from the input state.
 * @type {Parser<any, any>}
 */
export const LETTER: Parser<Char, Char> = labelled("letter")(candidate<Char, Char>(c => letterRegex.test(c)));

/**
 * A parser that expects letters or digits from the input state.
 * @type {Parser<any, any>}
 */
export const LETTERORDIGIT: Parser<Char, Char> = labelled("letter or digit")(candidate<Char, Char>(c => letterOrDigitRegex.test(c)));

/**
 * A parser that expects symbol marks from the input state.
 * @type {Parser<any, any>}
 */
export const SYMBOL: Parser<Char, Char> = labelled("symbol")(candidate<Char, Char>(c => symbolRegex.test(c)));

/**
 * A parser that expects whitespace from the input state.
 * @type {Parser<any, any>}
 */
export const WHITESPACE: Parser<Char, Char> = labelled("whitespace")(candidate<Char, Char>(c => whitespaceRegex.test(c)));

/**
 * A parser that expects multiple whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const WHITESPACES: Parser<Char, Char> = pipe(
    many(),
    labelled("whitespaces")
)(candidate<Char, Char>(c => whitespaceRegex.test(c)));

/**
 * A parser that expects multiple buffered whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const WHITESPACE_STRING: Parser<Char, string> = pipe(
    manyString(),
    labelled("whitespaces")
)(candidate<Char, Char>(c => whitespaceRegex.test(c)));

/**
 * A parser that skips whitespaces from the input state.
 * @type {Parser<any, any>}
 */
export const SKIP_WHITESPACES: Parser<Char, undefined> = pipe(
    skipMany(),
    labelled("skip whitespaces")
)(candidate<Char, Char>(c => whitespaceRegex.test(c)));
