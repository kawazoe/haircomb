import {Char} from "../Char";
import {labelled} from "../operators/labelled";
import {Parser} from "../Parser";
import {ofChar} from "./ofChar";
import {oneOf} from "./oneOf";

/**
 * A parser that expects either the UNIX style of Windows style end of line character sequence.
 * @type {Parser<any, any>}
 */
export const END_OF_LINE: Parser<Char, string> = labelled("End of line")(oneOf(ofChar("\n"), ofChar("\r\n")));
