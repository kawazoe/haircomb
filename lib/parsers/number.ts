import {Char} from "../Char";
import {Maybe} from "../maybe";
import {chainAtLeastOnceL} from "../operators/chainAtLeastOnceL";
import {labelled} from "../operators/labelled";
import {map} from "../operators/map";
import {optional} from "../operators/optional";
import {pipe} from "../operators/pipe";
import {Parser} from "../Parser";
import {candidate} from "./candidate";
import {ofChar} from "./ofChar";
import {oneOf} from "./oneOf";

const zeroCharCode = "0".charCodeAt(0);
const lowerAlphaCharCode = "a".charCodeAt(0);
const upperAlphaCharCode = "A".charCodeAt(0);

function getDigitValue(char: Char): number {
    return +char;
}

function getLetterOrDigitValue(char: Char): number {
    if (char >= "0" || char <= "9") {
        return getDigitValue(char);
    }

    if (char >= "A" || char <= "Z") {
        return char.charCodeAt(0) - upperAlphaCharCode + 10;
    }

    return char.charCodeAt(0) - lowerAlphaCharCode + 10;
}

function digitChar(base: number): Parser<Char, number> {
    if (base <= 10) {
        const baseTopChar = String.fromCharCode(zeroCharCode + base);
        return map(getDigitValue)(candidate<Char, Char>(c => c >= "0" && c <= baseTopChar));
    }

    const baseTopLowAlphaChar = String.fromCharCode(lowerAlphaCharCode + base - 10);
    const baseTopUpAlphaChar = String.fromCharCode(upperAlphaCharCode + base - 10);
    return map(getLetterOrDigitValue)(candidate<Char, Char>(
        c =>
            c >= "0" && c <= "9" ||
            c >= "A" && c <= baseTopUpAlphaChar ||
            c >= "a" && c <= baseTopLowAlphaChar
    ));
}

const isPositive: Parser<Char, boolean> = pipe(
    optional(),
    map((s: Maybe<Char>) => s !== "-")
)(oneOf(ofChar("+"), ofChar("-")));

/**
 * A parser that expects an unsigned integers from the input state.
 * @param {number} base
 *      The base that the number should be in.
 * @returns {Parser<Char, number>}
 */
export function unsignedInteger(base: number): Parser<Char, number> {
    return pipe(
        chainAtLeastOnceL(
            () => 0,
            (acc: number, val: number) => acc * base + val
        ),
        labelled(`base-${base} whole number`)
    )(digitChar(base));
}

/**
 * A parser that expects a signed integers from the input state
 * @param {number} base
 *      The base the the number should be in.
 * @returns {Parser<Char, number>}
 */
export function integer(base: number): Parser<Char, number> {
    return pipe(
        map(unsignedInteger(base), (sign, val) => sign ? val : -val),
        labelled(`base-${base} integer`)
    )(isPositive);
}

/**
 * A parser that expects an unsigned real from the input state.
 * @param {number} base
 * @returns {Parser<Char, number>}
 */
export function unsignedReal(base: number): Parser<Char, number> {
    return pipe(
        map(
            ofChar("."),
            unsignedInteger(base),
            (left: number, dot: Char, right: number) => +(left + dot + right)
        ),
        labelled(`base-${base} positive real`)
    )(unsignedInteger(base));
}

/**
 * A parser the expects a signed real from the input state.
 * @param {number} base
 * @returns {Parser<Char, number>}
 */
export function real(base: number): Parser<Char, number> {
    return pipe(
        map(unsignedReal(base), (sign, val) => sign ? val : -val),
        labelled(`base-${base} real`)
    )(isPositive);
}
