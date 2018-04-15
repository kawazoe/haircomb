import {Just, Maybe, Nothing} from "../maybe";
import {SourcePosition} from "../SourcePosition";
import {BaseParseState} from "./BaseParseState";
import {IPositioned} from "./IPositioned";

export abstract class InMemoryParseState<TToken> extends BaseParseState<TToken, IPositioned<number>> {
    public sourcePos: SourcePosition = new SourcePosition(1, 1);

    private _position: number = -1;
    private _current: Maybe<TToken> = Nothing();

    protected constructor(
        private count: number,
        private calculatePosition: (token: TToken, previous: SourcePosition) => SourcePosition
    ) {
        super();
    }

    public peek(): Maybe<TToken> {
        return this._current;
    }

    public advance(): void {
        if (this._current) {
            this.sourcePos = this.calculatePosition(this._current, this.sourcePos);
        }

        ++this._position;
        this.setCurrent();
    }

    protected getBookmark(): IPositioned<number> {
        return {
            value: this._position,
            position: this.sourcePos
        };
    }

    protected rewindBookmark(bookmark: IPositioned<number>): void {
        this._position = bookmark.value;
        this.setCurrent();
        this.sourcePos = bookmark.position;
    }

    protected abstract getElement(index: number): TToken;

    private setCurrent(): void {
        if (this._position >= this.count || this._position < 0) {
            this._current = Nothing();
            return;
        }

        this._current = Just(this.getElement(this._position));
    }
}
