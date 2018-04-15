import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {CandidateTokenParser} from "./impls/CandidateTokenParser";

/**
 * A parser that expects a token that matches a given predicate.
 * @param {(value: TToken) => boolean} predicate
 *      A predicate that takes a token from the input state and returns true if the
 *      parser should succeed for this token.
 * @returns {Parser<TToken, T>}
 */
export function candidate<TToken, T>(predicate: (token: TToken) => boolean): Parser<TToken, T> {
    if (!predicate) {
        throw new ArgumentNullDslError("predicate");
    }

    return new CandidateTokenParser<TToken, T>(predicate);
}
