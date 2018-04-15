
/**
 * A type representing a single character.
 *
 * In javascript, there is no concept of a character type, or even fixed length
 * strings for that matter. Since this library will most likely be used to parse
 * streams of characters, this pseudo char type is provided as a mean of clarity.
 */
export type Char = string;

/**
 * Convert a string to a Char using this type-guard function.
 * @param {string} char
 *      A string candidate for a Char.
 * @returns {boolean}
 *      Returns whether an input string is really a char.
 */
export function isChar(char: string): char is Char {
    return char.length === 1;
}

/**
 * Strictly cast a string into a Char.
 * @param {string} char
 *      A string candidate to convert to a Char.
 * @returns {Char}
 *      Returns the input Char if it is a Char or throw an Error if not.
 */
export function asCharStrict(char: string): Char {
    if (isChar(char)) {
        return char;
    } else {
        throw new Error(`Expected a Char type but got a String of "${char}" instead.`);
    }
}
