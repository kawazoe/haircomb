import {Maybe} from "../maybe";
import {IError} from "../parseError";
import {SourcePosition} from "../SourcePosition";

export interface IParseState<TToken> {
    readonly sourcePos: SourcePosition;
    error: IError<TToken>;

    peek(): Maybe<TToken>;
    advance(): void;

    pushBookmark(): void;
    popBookmark(): void;
    rewind(): void;
}
