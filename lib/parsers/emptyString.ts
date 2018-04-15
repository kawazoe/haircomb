import {Parser} from "../Parser";
import {ReturnParser} from "./impls/ReturnParser";

/**
 * A parser that returns an empty string.
 * @type {ReturnParser<any, string>}
 */
export const EMPTY_STRING: Parser<any, string> = new ReturnParser("");
