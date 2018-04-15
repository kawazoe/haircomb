import {asCharStrict, Char, isChar} from "../Char";
import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {token} from "./token";
import {tokenSequence} from "./tokenSequence";

/**
 * A parser that expects one or more characters from the input state.
 * @param {Char | string} characters
 *      The expected characters.
 * @returns {Parser<Char, Char>}
 */
export function ofChar(characters: Char | string): Parser<Char, Char> {
    if (!characters) {
        throw new ArgumentNullDslError("characters");
    }

    if (isChar(characters)) {
        return token<Char, Char>(asCharStrict(characters));
    }

    return tokenSequence<Char>(Array.from(characters));
}
