import {Parser} from "../Parser";
import {trace} from "./trace";

export function traceResult<TToken, T>(
    logger: (message: any) => void
): (parser: Parser<TToken, T>) => Parser<TToken, T> {
    return trace(logger, v => v);
}
