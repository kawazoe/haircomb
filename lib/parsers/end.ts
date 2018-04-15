import {Parser} from "../Parser";
import {EndParser} from "./impls/EndParser";

/**
 * A parser that expects the end of the input state.
 * @type {EndParser<any, any>}
 */
export const END: Parser<any, any> = new EndParser<any, any>();
