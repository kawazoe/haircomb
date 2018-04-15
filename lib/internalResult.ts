/**
 * Represents an internal result state of a parser when it succeeded to parse its input.
 */
export class SuccessfulInternalResult<T> {
    public constructor(
        public readonly value: T,
        public readonly hasConsumedInput: boolean = false
    ) {}
}

/**
 * Represents an internal result state of a parser when it failed to parse its input.
 */
export class FailureInternalResult {
    public constructor(
        public readonly hasConsumedInput: boolean = false
    ) {}
}

/**
 * Represents an internal result state of a parser.
 */
export type InternalResult<T> = SuccessfulInternalResult<T> | FailureInternalResult;

/**
 * Creates a new successful result.
 * @param {T} value
 *      The resulting parsed value.
 * @param {boolean} hasConsumedInput
 *      Whether the parser consumed part of its input.
 * @returns {InternalResult<T>}
 *      Returns a new instance of a SuccessfulInternalResult.
 * @constructor
 */
export function Succeed<T>(
    value: T,
    hasConsumedInput: boolean = false
): InternalResult<T> {
    return new SuccessfulInternalResult<T>(value, hasConsumedInput);
}

/**
 * Creates a new failed result.
 * @param {boolean} hasConsumedInput
 *      Whether the parser consumed part of its input.
 * @returns {InternalResult<void>}
 *      Returns a new instance of a FailureInternalResult.
 * @constructor
 */
export function Fail(hasConsumedInput: boolean = false): InternalResult<void> {
    return new FailureInternalResult(hasConsumedInput);
}
