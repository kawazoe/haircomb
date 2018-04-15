import {Char} from "../Char";
import {SourcePosition} from "../SourcePosition";
import {InMemoryParseState} from "./InMemoryParseState";

export class StringParseState extends InMemoryParseState<Char> {
    public constructor(
        private readonly input: string,
        positionCalculator: (token: Char, previous: SourcePosition) => SourcePosition
    ) {
        super(input.length, positionCalculator);
    }

    protected getElement(index: number): Char {
        return this.input[index];
    }
}
