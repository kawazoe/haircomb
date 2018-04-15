/**
 * Unwraps the arguments variable so that a call with multiple
 * parameters, or a single array of parameters are equivalent.
 * @param {IArguments} args
 *      The arguments variable of a function.
 * @returns {any[]}
 *      Returns an array of parameters from the args.
 */
export function expandArguments(args: IArguments): any[] {
    if (args[0] instanceof Array) {
        return args[0];
    } else {
        return Array.from(args);
    }
}
