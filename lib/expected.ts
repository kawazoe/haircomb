/**
 * An expected sequence of tokens as an input.
 */
export class ExpectedTokenSequence<TToken> {
    public constructor(
        public readonly tokens: TToken[]
    ) {}

    public toString(): string {
        return "<" + this.tokens.map((t: any) => t.toString()).join(", ") + ">";
    }
}

/**
 * An expected parser name as an input.
 */
export class ExpectedParser<TToken> {
    public constructor(
        public readonly label: string,
        public readonly expected: Expected<TToken>[]
    ) {}

    public toString(): string {
        return "\"" + this.label + "\"";
    }
}

/**
 * An expected end of file as an input.
 */
export class ExpectedEof {
    public toString(): string {
        return "EOF";
    }
}

/**
 * No expected input.
 */
export class ExpectedNoInput {
    public toString(): string {
        return "No Input";
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

export function unionExpected<TToken>(expectedCollection: Expected<TToken>[][]): Expected<TToken>[] {
    return expectedCollection.reduce((acc, cur) => acc.concat(cur), []);
}

export function concatExpected<TToken>(expectedCollection: Expected<TToken>[][]): Expected<TToken>[] {
    return unionExpected(expectedCollection);
    // return expectedCollection.reduce(
    //     (acc, cur) => {
    //         return acc.concat(cur);
    //     },
    //     [] as Array<Expected<TToken>>
    // );
}
