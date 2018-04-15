import {labelled} from "../operators/labelled";
import {Parser} from "../Parser";
import {candidate} from "./candidate";

/**
 * A parser that returns any token from the input state.
 * @type {Parser<any, any>}
 */
export const ANY: Parser<any, any> = labelled("any token")(candidate(() => true));
