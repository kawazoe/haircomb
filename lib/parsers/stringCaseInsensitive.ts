import {Char} from "../Char";
import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {StringCaseInsensitiveParser} from "./impls/StringCaseInsensitiveParser";

/**
 * A parser that parse an expected string in a case-insensitive manner.
 * @param {string} tokens
 *      The expected string.
 * @returns {Parser<Char, string>}
 */
export function stringCaseInsensitive(tokens: string): Parser<Char, string> {
    if (!tokens) {
        throw new ArgumentNullDslError("tokens");
    }

    return new StringCaseInsensitiveParser(tokens);
}
