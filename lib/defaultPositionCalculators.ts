import {Char} from "./Char";
import {SourcePosition} from "./SourcePosition";

/**
 * Calculate the position of the next token based on the size of the current token.
 * @param {Char} token
 *      The current token to evaluate.
 * @param {SourcePosition} previous
 *      The position of the previous token.
 * @returns {SourcePosition}
 *      Returns a the position of the current token.
 */
export function defaultCharPositionCalculator(token: Char, previous: SourcePosition): SourcePosition {
    return token === "\n"
        ? previous.nextLine()
        : token === "\t"
            ? previous.nextColumn(4)
            : previous.nextColumn();
}

/**
 * Advance the position of the next token by one, no matter the current token.
 * @param {TToken} _
 *      The current token to evaluate.
 * @param {SourcePosition} previous
 *      The position of the previous token.
 * @returns {SourcePosition}
 *      Returns a the position of the current token.
 */
export function defaultPositionCalculator<TToken>(_: TToken, previous: SourcePosition): SourcePosition {
    return previous.nextColumn();
}
