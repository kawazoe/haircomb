/**
 * A generic error happening while configuring the DSL.
 */
export class DslError extends Error {
    constructor(message: string) {
        super(message);
    }
}

/**
 * An unexpected null argument while configuring the DSL.
 */
export class ArgumentNullDslError extends DslError {
    constructor(param: string) {
        super(`'${param}' is a mandatory argument`);
    }
}

/**
 * An unexpected type for an argument while configuring the DSL.
 */
export class ArgumentInvalidTypeError extends DslError {
    constructor(param: string, type: string) {
        super(`'${param}' is invalid. Expected ${type}.`);
    }
}

/**
 * An invalid DSL configuration caught at runtime causing an infinite loop.
 */
export class ReentryError extends Error {
    constructor(currentParserName: string, reenteringParserName: string) {
        super(
            `Using '${currentParserName}' with a parser that does not consume inputs, ` +
            `like '${reenteringParserName}', will cause an infinite loop.`
        );
    }
}
