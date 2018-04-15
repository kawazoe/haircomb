import {Parser} from "../Parser";
import {ReturnParser} from "./impls/ReturnParser";

/**
 * A parser that returns an empty set of tokens.
 * @type {ReturnParser<any, any[]>}
 */
export const EMPTY: Parser<any, any> = new ReturnParser([] as any[]);
