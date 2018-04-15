import {ArgumentNullDslError} from "../exceptions";
import {Parser} from "../Parser";
import {map} from "./map";

export function tap<TToken, T>(action: (value: T) => void): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    if (!action) {
        throw new ArgumentNullDslError("action");
    }

    return map((v: T) => { action(v); return v; });
}
