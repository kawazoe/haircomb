import {Parser} from "../Parser";
import {CurrentPositionParser} from "./impls/CurrentPositionParser";

/**
 * A parser that returns the current position in the state.
 * @type {CurrentPositionParser<any, any>}
 */
export const CURRENT_POSITION: Parser<any, any> = new CurrentPositionParser<any, any>();
