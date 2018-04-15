import {Maybe} from "../maybe";
import {IError, UnknownError} from "../parseError";
import {SourcePosition} from "../SourcePosition";
import {IParseState} from "./IParseState";

export abstract class BaseParseState<TToken, TBookmark> implements IParseState<TToken> {
    public abstract sourcePos: SourcePosition;

    public error: IError<TToken> = new UnknownError<TToken>();

    public get hasBookmark() {
        return this._bookmarks.length !== 0;
    }

    private readonly _bookmarks: TBookmark[] = [];

    public abstract peek(): Maybe<TToken>;
    public abstract advance(): void;

    public pushBookmark(): void {
        this._bookmarks.push(this.getBookmark());
    }

    public popBookmark(): void {
        this._bookmarks.pop();
    }

    public rewind(): void {
        const bookmark = this._bookmarks.pop();

        if (bookmark) {
            this.rewindBookmark(bookmark);
        }
    }

    protected abstract getBookmark(): TBookmark;
    protected abstract rewindBookmark(bookmark: TBookmark): void;
}
