/**
 * Express an optional value of type T.
 */
export type Maybe<T> = T | void;

/**
 * Returns some optional value of type T.
 * @param {T} value
 *      The value to return.
 * @returns {Maybe<T>}
 *      Returns an optional value.
 * @constructor
 */
export function Just<T>(value: T): Maybe<T> {
    return value;
}

/**
 * Returns the lack of an optional value.
 * @constructor
 */
export function Nothing(): void {
    // no-op
}
