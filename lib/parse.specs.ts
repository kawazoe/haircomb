import {expect} from "chai";
import "mocha";

import {IJson, parseJson} from "../samples/json/jsonParser";
import {Char} from "./Char";
import {ParseResult} from "./ParseResult";

function expectJson(result: ParseResult<Char, IJson>, expectedValue: string): void {
    const message = result.successful
        ? undefined
        : result.error.toString();

    expect(result.successful, message).to.be.true;
    expect(result.result.toString()).to.equal(expectedValue);
}

describe("A json parser", () => {
    context("with a root array input", () => {
        it(
            "should parse an array",
            () => expectJson(parseJson(`[]`), `[]`)
        );

        it(
            "should parse an array regardless of whitespaces",
            () => expectJson(parseJson(` \n\t[\n\t  ]\n  \t`), `[]`)
        );

        context("with a single value", () => {
            it(
                "should parse an array of null",
                () => expectJson(parseJson(`[ null ]`), `[null]`)
            );

            it(
                "should parse an array of true",
                () => expectJson(parseJson(`[ true ]`), `[true]`)
            );

            it(
                "should parse an array of false",
                () => expectJson(parseJson(`[ false ]`), `[false]`)
            );

            it(
                "should parse an array of a non-signed number",
                () => expectJson(parseJson(`[ 42 ]`), `[42]`)
            );

            it(
                "should parse an array of a positive number",
                () => expectJson(parseJson(`[ +42 ]`), `[42]`)
            );

            it(
                "should parse an array of a negative number",
                () => expectJson(parseJson(`[ -42 ]`), `[-42]`)
            );

            it(
                "should parse an array of a string",
                () => expectJson(parseJson(`[ "foo" ]`), `["foo"]`)
            );

            it(
                "should parse an array of an empty array",
                () => expectJson(parseJson(`[ [] ]`), `[[]]`)
            );

            it(
                "should parse an array of an array recursively",
                () => expectJson(parseJson(`[ [ [ 42 ] ] ]`), `[[[42]]]`)
            );

            it(
                "should parse an array of an object",
                () => expectJson(parseJson(`[ { "foo": 42 } ]`), `[{"foo":42}]`)
            );

            it(
                "should parse an array of an object recursively",
                () => expectJson(parseJson(`[ { "foo": [ 42 ] } ]`), `[{"foo":[42]}]`)
            );
        });

        context("with multiple values", () => {
            it(
                "should parse an array of multiple nulls",
                () => expectJson(parseJson(`[ null, null, null ]`), `[null,null,null]`)
            );

            it(
                "should parse an array of multiple booleans",
                () => expectJson(parseJson(`[ true, false, true ]`), `[true,false,true]`)
            );

            it(
                "should parse an array of multiple scalar types",
                () => expectJson(parseJson(`[ 41, 42, 43 ]`), `[41,42,43]`)
            );

            it(
                "should parse an array of multiple complex types",
                () => expectJson(parseJson(`[ { "foo": null }, { "bar": null }, { "biz": null } ]`), `[{"foo":null},{"bar":null},{"biz":null}]`)
            );

            it(
                "should parse an array of multiple mixed types",
                () => expectJson(parseJson(`[ null, true, -42, 42, "", "foo", [], { "foo": null } ]`), `[null,true,-42,42,"","foo",[],{"foo":null}]`)
            );
        });
    });

    context("with a root object input", () => {
        it(
            "should parse an object",
            () => expectJson(parseJson(`{}`), `{}`)
        );

        it(
            "should parse an object regardless of whitespaces",
            () => expectJson(parseJson(` \n\t{\n\t  }\n  \t`), `{}`)
        );

        context("with a single property", () => {
            it(
                "should parse an object with a null property",
                () => expectJson(parseJson(`{ "foo": null }`), `{"foo":null}`)
            );

            it(
                "should parse an object with a true property",
                () => expectJson(parseJson(`{ "foo": true }`), `{"foo":true}`)
            );

            it(
                "should parse an object with a false property",
                () => expectJson(parseJson(`{ "foo": false }`), `{"foo":false}`)
            );

            it(
                "should parse an object with a non-signed number property",
                () => expectJson(parseJson(`{ "foo": 42 }`), `{"foo":42}`)
            );

            it(
                "should parse an object with a positive number property",
                () => expectJson(parseJson(`{ "foo": +42 }`), `{"foo":42}`)
            );

            it(
                "should parse an object with a negative number property",
                () => expectJson(parseJson(`{ "foo": -42 }`), `{"foo":-42}`)
            );

            it(
                "should parse an object with a string property",
                () => expectJson(parseJson(`{ "foo": "bar" }`), `{"foo":"bar"}`)
            );

            it(
                "should parse an object with an empty array property",
                () => expectJson(parseJson(`{ "foo": [] }`), `{"foo":[]}`)
            );

            it(
                "should parse an object with an array recursively property",
                () => expectJson(parseJson(`{ "foo": [ { "bar": [ { } ] } ] }`), `{"foo":[{"bar":[{}]}]}`)
            );

            it(
                "should parse an object with an object property",
                () => expectJson(parseJson(`{ "foo": { } }`), `{"foo":{}}`)
            );

            it(
                "should parse an object with an object recursively property",
                () => expectJson(parseJson(`{ "foo": { "bar": { "biz": 42 } } }`), `{"foo":{"bar":{"biz":42}}}`)
            );
        });

        context("with multiple properties", () => {
            it(
                "should parse an object with multiple null properties",
                () => expectJson(parseJson(`{ "foo": null, "bar": null, "biz": null }`), `{"foo":null,"bar":null,"biz":null}`)
            );

            it(
                "should parse an object with multiple booleans properties",
                () => expectJson(parseJson(`{ "foo": true, "bar": false, "biz": true }`), `{"foo":true,"bar":false,"biz":true}`)
            );

            it(
                "should parse an object with multiple scalar typed properties",
                () => expectJson(parseJson(`{ "foo": 41, "bar": 42, "biz": 43 }`), `{"foo":41,"bar":42,"biz":43}`)
            );

            it(
                "should parse an object with multiple complex typed properties",
                () => expectJson(parseJson(`{ "foo": [], "bar": [], "biz": [] }`), `{"foo":[],"bar":[],"biz":[]}`)
            );

            it(
                "should parse an object with multiple mixed typed properties",
                () => expectJson(
                    parseJson(`{ "foo": null, "bool": true, "bar": -42, "biz": 42, "baz": "", "buzz": "val", "blob": [], "bloop": { "blip": null } }`),
                    `{"foo":null,"bool":true,"bar":-42,"biz":42,"baz":"","buzz":"val","blob":[],"bloop":{"blip":null}}`
                )
            );
        });
    });

    describe("http://json.org/example.html", () => {
        it("glossary", () => {
            const source = `{
                "glossary": {
                    "title": "example glossary",
                    "GlossDiv": {
                        "title": "S",
                        "GlossList": {
                            "GlossEntry": {
                                "ID": "SGML",
                                "SortAs": "SGML",
                                "GlossTerm": "Standard Generalized Markup Language",
                                "Acronym": "SGML",
                                "Abbrev": "ISO 8879:1986",
                                "GlossDef": {
                                    "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                    "GlossSeeAlso": ["GML", "XML"]
                                },
                                "GlossSee": "markup"
                            }
                        }
                    }
                }
            }`;

            expect(parseJson(source).successful).to.be.true;
        });

        it("menu", () => {
            const source = `{"menu": {
              "id": "file",
              "value": "File",
              "popup": {
                "menuitem": [
                  {"value": "New", "onclick": "CreateNewDoc()"},
                  {"value": "Open", "onclick": "OpenDoc()"},
                  {"value": "Close", "onclick": "CloseDoc()"}
                ]
              }
            }}`;

            expect(parseJson(source).successful).to.be.true;
        });

        it("widget", () => {
            const source = `{"widget": {
                "debug": "on",
                "window": {
                    "title": "Sample Konfabulator Widget",
                    "name": "main_window",
                    "width": 500,
                    "height": 500
                },
                "image": {
                    "src": "Images/Sun.png",
                    "name": "sun1",
                    "hOffset": 250,
                    "vOffset": 250,
                    "alignment": "center"
                },
                "text": {
                    "data": "Click Here",
                    "size": 36,
                    "style": "bold",
                    "name": "text1",
                    "hOffset": 250,
                    "vOffset": 100,
                    "alignment": "center",
                    "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
                }
            }}`;

            expect(parseJson(source).successful).to.be.true;
        });

        it("web-app", () => {
            const source = `{"web-app": {
              "servlet": [
                {
                  "servlet-name": "cofaxCDS",
                  "servlet-class": "org.cofax.cds.CDSServlet",
                  "init-param": {
                    "configGlossary:installationAt": "Philadelphia, PA",
                    "configGlossary:adminEmail": "ksm@pobox.com",
                    "configGlossary:poweredBy": "Cofax",
                    "configGlossary:poweredByIcon": "/images/cofax.gif",
                    "configGlossary:staticPath": "/content/static",
                    "templateProcessorClass": "org.cofax.WysiwygTemplate",
                    "templateLoaderClass": "org.cofax.FilesTemplateLoader",
                    "templatePath": "templates",
                    "templateOverridePath": "",
                    "defaultListTemplate": "listTemplate.htm",
                    "defaultFileTemplate": "articleTemplate.htm",
                    "useJSP": false,
                    "jspListTemplate": "listTemplate.jsp",
                    "jspFileTemplate": "articleTemplate.jsp",
                    "cachePackageTagsTrack": 200,
                    "cachePackageTagsStore": 200,
                    "cachePackageTagsRefresh": 60,
                    "cacheTemplatesTrack": 100,
                    "cacheTemplatesStore": 50,
                    "cacheTemplatesRefresh": 15,
                    "cachePagesTrack": 200,
                    "cachePagesStore": 100,
                    "cachePagesRefresh": 10,
                    "cachePagesDirtyRead": 10,
                    "searchEngineListTemplate": "forSearchEnginesList.htm",
                    "searchEngineFileTemplate": "forSearchEngines.htm",
                    "searchEngineRobotsDb": "WEB-INF/robots.db",
                    "useDataStore": true,
                    "dataStoreClass": "org.cofax.SqlDataStore",
                    "redirectionClass": "org.cofax.SqlRedirection",
                    "dataStoreName": "cofax",
                    "dataStoreDriver": "com.microsoft.jdbc.sqlserver.SQLServerDriver",
                    "dataStoreUrl": "jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon",
                    "dataStoreUser": "sa",
                    "dataStorePassword": "dataStoreTestQuery",
                    "dataStoreTestQuery": "SET NOCOUNT ON;select test='test';",
                    "dataStoreLogFile": "/usr/local/tomcat/logs/datastore.log",
                    "dataStoreInitConns": 10,
                    "dataStoreMaxConns": 100,
                    "dataStoreConnUsageLimit": 100,
                    "dataStoreLogLevel": "debug",
                    "maxUrlLength": 500}},
                {
                  "servlet-name": "cofaxEmail",
                  "servlet-class": "org.cofax.cds.EmailServlet",
                  "init-param": {
                  "mailHost": "mail1",
                  "mailHostOverride": "mail2"}},
                {
                  "servlet-name": "cofaxAdmin",
                  "servlet-class": "org.cofax.cds.AdminServlet"},

                {
                  "servlet-name": "fileServlet",
                  "servlet-class": "org.cofax.cds.FileServlet"},
                {
                  "servlet-name": "cofaxTools",
                  "servlet-class": "org.cofax.cms.CofaxToolsServlet",
                  "init-param": {
                    "templatePath": "toolstemplates/",
                    "log": 1,
                    "logLocation": "/usr/local/tomcat/logs/CofaxTools.log",
                    "logMaxSize": "",
                    "dataLog": 1,
                    "dataLogLocation": "/usr/local/tomcat/logs/dataLog.log",
                    "dataLogMaxSize": "",
                    "removePageCache": "/content/admin/remove?cache=pages&id=",
                    "removeTemplateCache": "/content/admin/remove?cache=templates&id=",
                    "fileTransferFolder": "/usr/local/tomcat/webapps/content/fileTransferFolder",
                    "lookInContext": 1,
                    "adminGroupID": 4,
                    "betaServer": true}}],
              "servlet-mapping": {
                "cofaxCDS": "/",
                "cofaxEmail": "/cofaxutil/aemail/*",
                "cofaxAdmin": "/admin/*",
                "fileServlet": "/static/*",
                "cofaxTools": "/tools/*"},

              "taglib": {
                "taglib-uri": "cofax.tld",
                "taglib-location": "/WEB-INF/tlds/cofax.tld"}}}`;

            expect(parseJson(source).successful).to.be.true;
        });

        it("menu2", () => {
            const source = `{"menu": {
                "header": "SVG Viewer",
                "items": [
                    {"id": "Open"},
                    {"id": "OpenNew", "label": "Open New"},
                    null,
                    {"id": "ZoomIn", "label": "Zoom In"},
                    {"id": "ZoomOut", "label": "Zoom Out"},
                    {"id": "OriginalView", "label": "Original View"},
                    null,
                    {"id": "Quality"},
                    {"id": "Pause"},
                    {"id": "Mute"},
                    null,
                    {"id": "Find", "label": "Find..."},
                    {"id": "FindAgain", "label": "Find Again"},
                    {"id": "Copy"},
                    {"id": "CopyAgain", "label": "Copy Again"},
                    {"id": "CopySVG", "label": "Copy SVG"},
                    {"id": "ViewSVG", "label": "View SVG"},
                    {"id": "ViewSource", "label": "View Source"},
                    {"id": "SaveAs", "label": "Save As"},
                    null,
                    {"id": "Help"},
                    {"id": "About", "label": "About Adobe CVG Viewer..."}
                ]
            }}`;

            expect(parseJson(source).successful).to.be.true;
        });
    });
});
