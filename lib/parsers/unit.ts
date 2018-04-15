import {Nothing} from "../maybe";
import {Parser} from "../Parser";
import {ReturnParser} from "./impls/ReturnParser";

/**
 * A parser that returns nothing.
 * @type {ReturnParser<any, any>}
 */
export const UNIT: Parser<any, void> = new ReturnParser(Nothing());
