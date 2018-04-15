import {Parser} from "../Parser";
import {RecursiveParser} from "./impls/RecursiveParser";

/**
 * A parser that proxies an other parser, postponing its resolution until the execution phase.
 * @param {Parser<TToken, T> | (() => Parser<TToken, T>)} parserProvider
 *      A function that returns the parser to use while parsing the input state.
 * @returns {Parser<TToken, T>}
 */
export function recursive<TToken, T>(parserProvider: Parser<TToken, T> | (() => Parser<TToken, T>)): Parser<TToken, T> {
    if (typeof parserProvider === "function") {
        return new RecursiveParser(parserProvider);
    }

    return new RecursiveParser(() => parserProvider);
}
