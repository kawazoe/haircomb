import {Char} from "../Char";
import {Parser} from "../Parser";
import {stringCaseInsensitive} from "./stringCaseInsensitive";

/**
 * A parser that expects a case-insensitive character from the input state.
 * @param {Char} character
 *      The character to expect.
 * @returns {Parser<Char, Char>}
 */
export function charCaseInsensitive(character: Char): Parser<Char, Char> {
    return stringCaseInsensitive(character);
}
