# haircomb
A typescript parser combinator library heavily inspired by [Pidgin](https://github.com/benjamin-hodgson/Pidgin).

## usage
This library provides a set of low-level, atom level parsers that can be composed together in chains to form more
complex operations. It includes a complete-enough set of atoms to handle most common and uncommon grammar use-cases
but does not includes any higher level parsers besides the included samples, which are themselves very limited.

Parsers are used in two phases. The first phase is the composition phase where you can combine them into chains using the
various provided operators or even create your own. The second phase is the execution phase where an input state is
provided to the `parse` method of the chain, expecting a result. 

All parsers are regrouped into two broad categories: parsers and operators. Parsers are simple atoms that extracts
values from an input state. Operators are atoms that transforms the result of other atoms, themselves returning their
result to the next parser in the chain.

From there, you can find two other sub-categories of parsers: classes and functions. Class parsers inherit from the
`Parser<TToken, T>` base class which provides the base infrastructure for all other parsers to build on top of. They are
simple classes with the goal of taking values out of the input state to produce their results. Function parsers are used
to build a DSL around class parsers to make it easier to compose them and chain them together. They typically are
defined as higher-order functions, compatible with the
[pipeline operator proposal](https://github.com/tc39/proposal-pipeline-operator) from tc39.

As an interim solution, this library also includes a `pipe(...)` operator that can be used to compose parsers.

## parsers
To configure a parser like the `TokenSequenceParser<TToken, T>` to parse a sequence of a single token like a character
out of a string, you could use the following snippet of code:

```const lowerCaseA = new TokenSequenceParser<Char, Char>([ "a" ]);```

But a much simpler way of accomplishing this is to use the provided DSL function, which takes case of the boiler plate
for you:

```const lowerCaseA = ofChar("a");```

As you can see, even though there are over 25 parser functions, those parsers are very bare-bone and cannot accomplish
much on their own. This is why you need operators to combine them into chains.

## operators
You can use operators to define a chain of parsers to accomplish more complex tasks. For instance, you could use the
following incredibly complicated snippet of code to parse a simple quoted string:

```
const quote = new TokenSequenceParser([ '"' ]); 
const quotedString = Map3Parser<Char, string, string, string, string>(
    quote,
    new OneOfParser<Char, string>(
        new Map1Parser<Char, Char[], string>(
            acc => acc.join(""),
            new ChainAtLeastOnceLParser<Char, string>(
                new CandidateTokenParser<Char, Char>(c => c !== '"'),
                () => [] as Char[],
                (acc, c) => { acc.push(c); return acc; }
            )
        ),
        new ReturnParser("")
    )
    quote,
    (leftQuote, content, rightQuote) => content
);
```

This chain starts by looking for a quote character, followed by at least one non quote character and ending at an other
quote character. In the end, it returns the content of the string. Or, you could simply use the provided DSL which
builds on top of these parsers to provide a much friendlier syntax:

```
const quote = ofChar('"');
const quotedString = pipe(
    manyString(),
    between(quote)
)(candidate(c => c !== '"'));
```

Here you can see how the `pipe` operator enables you to compose multiple parsers together, returning a higher-order
function ready to accept an other parser as its input. You can also see how easily we can reuse parsers multiple times
as they are all stateless components.

# execution
Once your parsing chain is configured, you can use the `parse(...)` method to attempt to produce an AST from an input
value. The structure of this AST is defined by how you build the chain of parsers. This structure will be created with
usage of the `map` function to project the raw result of a parser to a more complex object. For a concrete example on
how this is done, take a look at the included `JsonParser` sample which produces a structure of `JsonObject`,
`JsonMember`, `JsonArray`, and `JsonString`.

A typical execution would look like this:

```const result = parse('"a quoted string"').with(quotedString);```

Which returns a `ParseResult<TToken, T>`. This result can either represent a successful value, in which case the
`successful` property will be set to true and the `result` property will return a meaningful value, or it could
represent an error, in which case the `successful` property will be set to false and the `error` property will contain
a description of the error.
