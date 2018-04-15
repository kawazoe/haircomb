/**
 * Represents the position of a token within a two dimensional stream of token.
 */
export class SourcePosition {
    /**
     * Creates a new instance of a {SourcePosition}.
     * @param {number} line
     *      The line number at which a given token is present.
     * @param {number} column
     *      The column number at which a given token is present.
     */
    public constructor(
        public readonly line: number,
        public readonly column: number
    ) {
    }

    /**
     * Clone this position by moving down the lines of tokens.
     * @param {number} jumpSize
     *      An optional amount of lines to move down to. Defaults to 1.
     * @returns {SourcePosition}
     *      Returns a new instance of the source position with its line number incremented to the new value.
     */
    public nextLine(jumpSize?: number) {
        return new SourcePosition(this.line + (jumpSize || 1), this.column);
    }

    /**
     * Clone this position by moving right the columns of tokens.
     * @param {number} jumpSize
     *      An optional amount of columns to move right to. Defaults to 1.
     * @returns {SourcePosition}
     *      Returns a new instance of the source position with its column number incremented to the new value.
     */
    public nextColumn(jumpSize?: number) {
        return new SourcePosition(this.line, this.column + (jumpSize || 1));
    }
}
