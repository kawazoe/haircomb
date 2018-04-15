import {Char} from "../Char";
import {labelled} from "../operators/labelled";
import {Parser} from "../Parser";
import {integer, real} from "./number";

/**
 * A parser that expects a base 8 signed integer from the input state.
 * @type {Parser<any, any>}
 */
export const OCTAL_INTEGER: Parser<Char, number> = labelled("octal integer")(integer(8));

/**
 * A parser that expects a base 10 signed integer from the input state.
 * @type {Parser<any, any>}
 */
export const DECIMAL_INTEGER: Parser<Char, number> = labelled("decimal integer")(integer(10));

/**
 * A parser that expects a base 16 signed integer from the input state.
 * @type {Parser<any, any>}
 */
export const HEXADECIMAL_INTEGER: Parser<Char, number> = labelled("hexadecimal integer")(integer(16));

/**
 * A parser that expects a base 8 signed real from the input state.
 * @type {Parser<any, any>}
 */
export const OCTAL_REAL: Parser<Char, number> = labelled("octal real")(real(8));

/**
 * A parser that expects a base 10 signed real from the input state.
 * @type {Parser<any, any>}
 */
export const DECIMAL_REAL: Parser<Char, number> = labelled("decimal real")(real(10));

/**
 * A parser that expects a base 16 signed real from the input state.
 * @type {Parser<any, any>}
 */
export const HEXADECIMAL_REAL: Parser<Char, number> = labelled("hexadecimal real")(real(16));
