import {SourcePosition} from "../SourcePosition";

export interface IPositioned<T> {
    readonly value: T;
    readonly position: SourcePosition;
}
