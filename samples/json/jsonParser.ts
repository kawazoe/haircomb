import {Char} from "../../lib";
import {before, between, labelled, manyString, map, or, pipe, separated, then} from "../../lib/operators";
import {parse} from "../../lib/parse";
import {ParseResult} from "../../lib/ParseResult";
import {candidate, charPatterns, numberPattern, ofChar, oneOf, recursive} from "../../lib/parsers";

// First let's declare some system types
export interface IKeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

// Here we declare the base interface that our AST will use for all the nodes in the tree.
export interface IJson {
    toString(): string;
}

// Then we declare all of the node types that will be used to build the AST.
export class JsonNull implements IJson {
    public toString(): string {
        return "null";
    }
}

export class JsonBoolean implements IJson {
    public constructor(public readonly val: boolean) {}

    public toString(): string {
        return "" + this.val;
    }
}

export class JsonNumber implements IJson {
    public constructor(public readonly val: number) {}

    public toString(): string {
        return "" + this.val;
    }
}

export class JsonString implements IJson {
    public constructor(public readonly val: string) {}

    public toString(): string {
        return `"${this.val}"`;
    }
}

export class JsonArray implements IJson {
    public constructor(public readonly vals: IJson[]) {}

    public toString(): string {
        return `[${this.vals.map(v => v.toString()).join(",")}]`;
    }
}

export type JsonProperty = IKeyValuePair<string, IJson>;

export class JsonObject implements IJson {
    public constructor(public readonly properties: JsonProperty[]) {}

    public toString(): string {
        return `{${this.properties.map(pair => `"${pair.key}":${pair.value}`).join(",")}}`;
    }
}

// Now we can start to declare the various static tokens that our grammar expects.
const lBrace = ofChar("{");
const rBrace = ofChar("}");
const lBracket = ofChar("[");
const rBracket = ofChar("]");
const quote = ofChar("\"");
const colon = ofChar(":");
const colonWhitespace = between(charPatterns.SKIP_WHITESPACES)(colon);
const comma = ofChar(",");
const nullToken = ofChar("null");
const trueToken = ofChar("true");
const falseToken = ofChar("false");

// Since the quoted string (or C style string) is so popular, let's create a simple parser just for them.
// This parser will look for
//  - many characters (as a string)
//  - until it hits a quote (the expected closing quote) between
//  - between quotes
// The "candidate" parser is very important here, or else the quote character will be swallowed by
// the "manyString" operator before it can reaches the "between" operator.
const quotedString = pipe(
    manyString(),
    between(quote)
)(candidate(c => c !== "\""));

// At this point we can already map our simplest parsers to our AST objects.
const jsonNull = map(() => new JsonNull())(nullToken);
const jsonTrue = map(() => new JsonBoolean(true))(trueToken);
const jsonFalse = map(() => new JsonBoolean(false))(falseToken);
const jsonBoolean = or(jsonFalse)(jsonTrue);
const jsonNumber = map((n: number) => new JsonNumber(n))(numberPattern.DECIMAL_INTEGER);
const jsonString = map((s: string) => new JsonString(s))(quotedString);

// Now we start to build up on our AST to create composite types.
const jsonValue = oneOf([
    labelled("JNull")(jsonNull),
    labelled("JBoolean")(jsonBoolean),
    labelled("JNumber")(jsonNumber),
    labelled("JString")(jsonString),
    labelled("JObject value")(recursive(() => jsonArray)),
    labelled("JArray value")(recursive(() => jsonObject))
]);

// Here we can define the two most complex types of the JSON specification:
//  - the JSON array composes none, one or multiple jsonValues.
//  - the JSON object composes none, one or multiple key/value pair (that are handled by the jsonMembers parser).
const jsonArray = pipe(
    between(charPatterns.SKIP_WHITESPACES),
    separated(comma),
    between(lBracket, rBracket),
    map((els: IJson[]) => new JsonArray(els))
)(jsonValue);

const jsonMember = pipe(
    before(colonWhitespace),
    then(jsonValue, (key: string, val: IJson) => ({ key, value: val } as JsonProperty))
)(quotedString);

const jsonObject = pipe(
    between(charPatterns.SKIP_WHITESPACES),
    separated(comma),
    between(lBrace, rBrace),
    map((pairs: JsonProperty[]) => new JsonObject(pairs))
)(jsonMember);

// Finally we defined the types that are accepted at the root of the document...
const jsonRoot = oneOf([
    labelled("root JObject")(jsonObject),
    labelled("root JArray")(jsonArray)
]);

// ... and we export a function that will use our final parser to build our AST.
export function parseJson(input: string): ParseResult<Char, IJson> {
    return parse<IJson>(input).with(jsonRoot);
}
