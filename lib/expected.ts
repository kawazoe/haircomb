/**
 * An expected sequence of tokens as an input.
 */
export class ExpectedTokenSequence<TToken> {
    public constructor(
        public readonly tokens: TToken[]
    ) {}

    public toString(): string {
        return "Expected tokens: <" + this.tokens.map(t => t.toString()).join(", ") + ">";
    }
}

/**
 * An expected parser name as an input.
 */
export class ExpectedParser<TToken> {
    public constructor(
        public readonly label: string,
        public readonly expected: Array<Expected<TToken>>
    ) {}

    public toString(): string {
        return "Expected: " + this.label;
    }
}

/**
 * An expected end of file as an input.
 */
export class ExpectedEof {
    public toString(): string {
        return "Expected Eof";
    }
}

/**
 * No expected input.
 */
export class ExpectedNoInput {
    public toString(): string {
        return "Expected No Input";
    }
}

/**
 * An expected input.
 */
export type Expected<TToken> =
    ExpectedTokenSequence<TToken> |
    ExpectedParser<TToken> |
    ExpectedEof |
    ExpectedNoInput;

export function unionExpected<TToken>(expectedCollection: Array<Array<Expected<TToken>>>): Array<Expected<TToken>> {
    return expectedCollection.reduce((acc, cur) => acc.concat(cur), []);
}

function flatmapEach<TSource, TCollection, TResult>(
    sources: TSource[],
    collectionSelector: (s: TSource) => TCollection[],
    resultSelector: (s: TSource, c: TCollection) => TResult
): TResult[] {
    const results = [] as TResult[];

    for (const value of sources) {
        for (const collection of collectionSelector(value)) {
            results.push(resultSelector(value, collection));
        }
    }

    return results;
}

export function concatExpected<TToken>(expectedCollection: Array<Array<Expected<TToken>>>): Array<Expected<TToken>> {
    return expectedCollection.reduce((prev, cur) => flatmapEach(prev, () => cur, (left, right) => {
        if (left instanceof ExpectedTokenSequence && left.tokens.length === 0) {
            return right;
        }

        if (left instanceof ExpectedTokenSequence && right instanceof ExpectedTokenSequence) {
            return new ExpectedTokenSequence(left.tokens.concat(right.tokens));
        }

        return left;
    }));
}
