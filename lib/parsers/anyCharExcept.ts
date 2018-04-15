import {Char} from "../Char";
import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {candidate} from "./candidate";

/**
 * A parser that returns any one character not in a list of characters from the input state.
 * @param {Char[]} excludedCharacters
 *      The list of excluded characters.
 * @returns {Parser<Char, Char>}
 */
export function anyCharExcept(excludedCharacters: Char[]): Parser<Char, Char> {
    if (!excludedCharacters) {
        throw new ArgumentNullDslError("excludedCharacters");
    }

    return candidate(c => !excludedCharacters.includes(c));
}
