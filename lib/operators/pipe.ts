import {compose} from "../compose";
import {Parser} from "../Parser";

export type Pipeable<TToken, T, R> = (that: Parser<TToken, T>) => Parser<TToken, R>;

export function pipe<TToken, T>(
): (parser: Parser<TToken, T>) => Parser<TToken, T>;
export function pipe<TToken, T, R>(
    func1: Pipeable<TToken, T, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, I4, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, I4>,
    func5: Pipeable<TToken, I4, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, I4, I5, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, I4>,
    func5: Pipeable<TToken, I4, I5>,
    func6: Pipeable<TToken, I5, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, I4, I5, I6, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, I4>,
    func5: Pipeable<TToken, I4, I5>,
    func6: Pipeable<TToken, I5, I6>,
    func7: Pipeable<TToken, I6, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, I4, I5, I6, I7, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, I4>,
    func5: Pipeable<TToken, I4, I5>,
    func6: Pipeable<TToken, I5, I6>,
    func7: Pipeable<TToken, I6, I7>,
    func8: Pipeable<TToken, I7, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, I4, I5, I6, I7, I8, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, I4>,
    func5: Pipeable<TToken, I4, I5>,
    func6: Pipeable<TToken, I5, I6>,
    func7: Pipeable<TToken, I6, I7>,
    func8: Pipeable<TToken, I7, I8>,
    func9: Pipeable<TToken, I8, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, I1, I2, I3, I4, I5, I6, I7, I8, I9, R>(
    func1: Pipeable<TToken, T, I1>,
    func2: Pipeable<TToken, I1, I2>,
    func3: Pipeable<TToken, I2, I3>,
    func4: Pipeable<TToken, I3, I4>,
    func5: Pipeable<TToken, I4, I5>,
    func6: Pipeable<TToken, I5, I6>,
    func7: Pipeable<TToken, I6, I7>,
    func8: Pipeable<TToken, I7, I8>,
    func9: Pipeable<TToken, I8, I9>,
    func0: Pipeable<TToken, I9, R>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;
export function pipe<TToken, T, R>(
    ...funcs: Array<Pipeable<TToken, any, R>>
): (parser: Parser<TToken, T>) => Parser<TToken, R>;

export function pipe<TToken, T, R>(
    ...funcs: Array<Pipeable<TToken, any, R>>
): (parser: Parser<TToken, T>) => Parser<TToken, R> {
    return function pipeInternal(parser: Parser<TToken, T>): Parser<TToken, R> {
        if (funcs.length === 0) {
            return parser as any;
        }

        if (funcs.length === 1) {
            return funcs[0](parser);
        }

        return compose(...funcs)(parser);
    };
}
