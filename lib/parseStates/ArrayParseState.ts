import {SourcePosition} from "../SourcePosition";
import {InMemoryParseState} from "./InMemoryParseState";

export class ArrayParseState<TToken> extends InMemoryParseState<TToken> {
    public constructor(
        private readonly input: TToken[],
        positionCalculator: (token: TToken, previous: SourcePosition) => SourcePosition
    ) {
        super(input.length, positionCalculator);
    }

    protected getElement(index: number): TToken {
        return this.input[index];
    }
}
