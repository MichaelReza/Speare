import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

// Programs that are semantically correct
const semanticChecks = [
  [
    // [1] DONE
    "variable declarations",
    "alloweth Numeral x be 1\
    alloweth ToBeOrNotToBe y be fallacious",
  ],
  // [2] DONE
  ["increment and decrement",
    "alloweth Numeral x be 1 \
    x incrementby 2 \
    x increment \
    x incrementby 5",
  ],
  // [3] DONE
  ["initialize with nonempty array", "alloweth Liste of Numeral n be [5, 8]"],
  // [4] DONE
  ["function declaration", "enter ToBeOrNotToBe foo( Numeral f ) {}"],
  // [5] DONE
  ["assign arrays",
  "alloweth Numeral xcontext be 0 \
   alloweth Numeral y be 2 \
   alloweth Numeral z be 1 \
   alloweth Liste of Numeral w be [6, 4, 5, 4, 3] \
   alloweth Liste of ToBeOrNotToBe a be [fallacious, fallacious, faithful] \
   alloweth Liste of Numeral x be [xcontext, y without z]"
  ],
  // [6] DONE
  ["short return", "enter ToBeOrNotToBe foo(Numeral f) { returneth }"],
  // [7] DONE
  ["long return", "enter ToBeOrNotToBe foo(Numeral f) { returneth faithful }"],
  // [8] DONE
  [
    "return in nested if",
    "enter ToBeOrNotToBe foo(Numeral f) { whether (faithful) { returneth } }",
  ],
  // [9] DONE
  ["break in nested if",
  "whilst(fallacious) { whether (faithful) { exit } }"
  ],
  // [10] DONE
  ["long if", "whether (faithful) { speaketh(1) } otherwise {speaketh(3) }"],
  // [11] DONE
  [
    "else if",
    "whether (faithful) { speaketh(1)} subsequently (faithful) { speaketh(0) } otherwise {speaketh(3) }",
  ],
  // [12] TODO
  // ["for over collection",
  // "alloweth Liste of Numeral y be [1, 2] \
  //  in regards to(x within y) { speaketh(x) }"
  // ],
  // [13] TODO
  [
    "for in range",
    "in regards to (alloweth Numeral x be 0, x lesser 15, x increment) { speaketh(x) }",
  ],
  // [13] TODO
  ["nested for in range",
  "in regards to (alloweth Numeral i be 0, i lesser 15, i increment) { \
     in regards to (alloweth Numeral j be 0, j lesser 15, j increment) { \
       speaketh(i with j) \
     }\
   }"
  ],
  // [14] TODO
  ["conditionals with ints",
  "whether(faithful) { speaketh(5) } otherwise { speaketh(6) }"
  ],
  // [15] TODO
  [
    "conditionals with floats",
    "whether(1.2 lesser 1.6) { speaketh(5.6) } otherwise {speaketh(6.1) }",
  ],
  // [16] DONE
  [
    "conditionals with strings",
    'whether(1 lesser 6) { speaketh("hello") } otherwise {speaketh("Goodbye") }',
  ],
  // [17] DONE
  [
    "OR",
    "speaketh(faithful alternatively 1 lesser 2 alternatively fallacious alternatively faithful)",
  ],
  // [18] DONE
  [
    "AND",
    "speaketh(faithful furthermore 1 furthermore 2 furthermore fallacious tis not faithful)",
  ],
  // [19] DONE -- had to add lexicographical into parser
  [
    "relations",
    'speaketh(1 tis lesser 2 furthermore "x" nobler "y" furthermore 3.5 tis lesser 1.2)',
  ],
  // [20] DONE
  ["ok to == arrays", "speaketh([1] tis [5,8])"],
  // [21] DONE
  ["ok to != arrays", "speaketh([1] tis not [5,8])"],
  // [22] DONE
  ["arithmetic", "speaketh(5 exponentiate nay(3))"],
  // [23] DONE
  [
    "variables",
    "alloweth Liste of Liste of Liste of Liste of Numeral x be [[[[1]]]]",
  ],
  // [25] DONE
  ["nested structs",
  "alloweth Concordance of Lexicographical and Numeral c be {\"z\": 1}\
  alloweth Concordance of Lexicographical and Concordance of Lexicographical and Numeral b be {\"y\": c}\
  alloweth Concordance of Lexicographical and Concordance of Lexicographical and Concordance of Lexicographical and Numeral a be {\"x\": b}\
  speaketh(a.\"x\".\"y\".\"z\")"],
  // [26] TODO: REWRITE THIS GARBAGE
  [
    "subscript dict",
    "alloweth Concordance of Lexicographical and Numeral y be {\"x\": 5} speaketh(y.\"x\")",
  ],
  // [27] TODO: REWRITE THIS GARBAGE
  ["subscript liste", "alloweth Liste of Numeral a be [1,2] speaketh(a[0])"],
  // [28] TODO: REWRITE THIS GARBAGE
  [
    "array of corollary",
    'alloweth Liste of Concordance of Lexicographical and Numeral S be [{"x": 1}, {"y": 1}]',
  ],
  // [29] TODO: REWRITE THIS GARBAGE
  [
    "corollary of Listes",
    'alloweth Concordance of Lexicographical and Liste of Numeral S be {"x": [1,2,3]}',
  ],
 
  // [32] TODO
  [
    "call of assigned function in expression",
    `enter Indistinguishable f(Numeral x, ToBeOrNotToBe y) {}
    alloweth Enter g be f
    speaketh(g(1, true))
    f be g // Type check here`,
  ],

  // [35] DONE
["concordance parameters", "alloweth Concordance of Numeral and Numeral S be {5 : 12}\nenter ToBeOrNotToBe fun(Concordance of Numeral and Numeral x) {}"],
  // [36] TODO - we arent doing optionals (for now)
  ["array parameters",
  "enter Indistinguishable f(Numeral? x) {}"
  ],
  // [37] TODO - not supporting options (for now)
  ["optional parameters",
  "enter Indistinguishable f(Numeral x, Lexicographical? y) {}"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  // [38] DONE
  ["non-distinct fields", "alloweth Concordance of Lexicographical and Numeral S be {\"x\": 1, \"x\": 2}", /Keys must be distinct/],
  // [39] TODO
  ["non-int increment", "alloweth Numeral x be fallacious x increment", /an integer, found boolean/],
  // [40] TODO: REWRITE THIS GARBAGE
  ["non-int decrement", 'alloweth Lexicographical x = "hello" x increment', /an integer, found [string]?/], //TO-DO bc some[""] is optional and I am confused
  // [41] DONE
  ["undeclared id", "speaketh(x)", /Identifier x not declared/],
  // [42] DONE
  ["redeclared id", "alloweth Numeral x be 1 alloweth Numeral x be 1", /Identifier x already declared/],
  // [43] TODO
  ["assign bad type", "alloweth Numeral x be faithful", /Cannot assign a boolean to a int/],
  // [44] TODO
  ["assign bad array type", "alloweth Numeral x be 1 alloweth Liste x be [true]", /Cannot assign a \[boolean\] to a int/],
  // [45] DONE
  ["break outside loop", "exit", /Break can only appear in a loop/],
  // [46] TODO: REWRITE THIS GARBAGE
  [
    "break inside function",
    "whilst(x){execute{exit}}",
    /Break can only appear in a loop/,
  ],
  // [47] TODO
  ["return outside function", "returneth", /Return can only appear in a function/],
  // [48] TODO
  [
    "return value from void function",
    "enter f() {returneth 1}",
    /Cannot return a value here/,
  ],
  // [49] TODO
  [
    "return nothing from non-void",
    "enter Numeral f(){ returneth }",
    /should be returned here/,
  ],
  // [50] TODO
  ["return type mismatch", "enter Numeral f(){returneth fallacious}", /ToBeOrNotToBe to a number/],
  // [51] TODO
  ["non-boolean short if test", "whether (1) {}", /a ToBeOrNotToBe, found number/],
  // [52] TODO
  ["non-boolean if test", "whether (1) {} otherwise {}", /a boolToBeOrNotToBeean, found number/],
  // [53] TODO
  ["non-boolean while test", "whilest (1) {}", /a ToBeOrNotToBe, found number/],
  // [54] TODO
  ["non-integer range", "in regards to (i within faithful){}", /a number, found ToBeOrNotToBe/],
  // [55] TODO
  ["non-array in for", "in regards to(i within 100) {}", /Array expected/],
  // [56] TODO
  ["non-boolean conditional test", "whether (1) {}", /a ToBeOrNotToBe, found number/],
  // [57] TODO
  ["diff types in conditional arms", "whether (x be 5) { x be fallacious } ", /not have the same type/],
  // [58] TODO
  ["bad types for ||", "speaketh(fallacious alternatively 1) ", /a ToBeOrNotToBe, found number/],
  // [59] TODO
  ["bad types for and", "speaketh(fallacious furthermore 1) ", /a ToBeOrNotToBe, found number/],
  // [60] DONE
  ["bad types for ==", "speaketh(fallacious tis 1) ", /Operands do not have the same type/],
  // [61] DONE
  ["bad types for !=", "speaketh(fallacious tis 1) ", /Operands do not have the same type/],
  // [62] TODO
  ["bad types for +", "speaketh(fallacious with 1) ", /number or string, found ToBeOrNotToBe/],
  // [63] TODO
  ["bad types for -", "speaketh(fallacious without 1) ", /a number, found ToBeOrNotToBe/],
  // [64] TODO
  ["bad types for *", "speaketh(fallacious accumulate 1) ", /a number, found ToBeOrNotToBe/],
  // [65] DONE
  ["bad types for /", "speaketh(fallacious sunder 1) ", /a number, found ToBeOrNotToBe/],
  // [66] DONE
  ["bad types for **", "speaketh(fallacious exponentiate 1) ", /a number, found ToBeOrNotToBe/],
  // [67] DONE
  ["bad types for <", "speaketh(fallacious lesser 1) ", /number or string, found ToBeOrNotToBe/],
  // [68] DONE
  ["bad types for <=", "speaketh(fallacious tis lesser 1) ", /number or string, found ToBeOrNotToBe/],
  // [69] DONE
  ["bad types for >", "speaketh(fallacious nobler 1) ", /number or string, found ToBeOrNotToBe/],
  // [70] DONE
  ["bad types for >=", "speaketh(fallacious tis nobler 1) ", /number or string, found ToBeOrNotToBe/],
  // [71] DONE
  ["bad types for ==", "speaketh(2 tis fallacious) ", /not have the same type/],
  // [72] DONE
  ["bad types for !=", "speaketh(fallacious tis not 1) ", /not have the same type/],
  // [73] TODO
  ["bad types for negation", "speaketh(nay(faithful)) ", /a number, found ToBeOrNotToBe/],
  // [74] TODO
  ["bad types for length", "speaketh(#fallacious)", /Array expected/],
  // [75] TODO
  ["bad types for not", 'speaketh(nay("hello"))', /a ToBeOrNotToBe, found Lexicographical/],
  // [76] TODO
  ["non-integer index", "alloweth a be [1] speaketh(a[fallacious])", /number, found ToBeOrNotToBe/],
  // [77] TODO
  ["diff type array elements", "speaketh([3,3.0])", /Not all elements have the same type/],
  // [78] TODO
  ["shadowing", "alloweth Numeral x be 1 \
                whilst (faithful) { \
                  alloweth Numeral  x be 1 \
                }", /Identifier x already declared/],
  // [79] TODO
  ["call of uncallable", "alloweth x be 1\nspeaketh(x())", /Call of non-function/],
  // [80] TODO
  [
    "Too many args",
    "enter Indistinguishable f(Numeral x) {}\nf(1,2)",
    /1 argument\(s\) required but 2 passed/,
  ],
  // [81] TODO
  [
    "Too few args",
    "enter Indistinguishable f(Numeral x) {}\nf()",
    /1 argument\(s\) required but 0 passed/,
  ],
  // [82] TODO
  [
    "Parameter type mismatch",
    "enter f(Numeral x) {}\nf(fallacious)",
    /Cannot assign a boolean to a int/,
  ],
  // [83] TODO
  [
    "function type mismatch",
    `enter f( Numeral x, y: (boolean)->void): int { return 1 }
     enter g(z: boolean): int { return 5 }
     f(2, g)`,
    /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  ],
  // [84] TODO
  ["Non-type in param", "alloweth Numeral x be 1 enter Indistinguishable f(x y){}", /Type expected/],
  // [85] TODO
  ["Non-type in return type", "alloweth Numeral x be 1 enter x f(){returneth 1}", /Type expected/],
  // [86] TODO
  ["Non-type in field type", "alloweth Numeral x be 1struct S {y:x}", /Type expected/],
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  // for (const [scenario, source, graph] of graphChecks) {
  //   it(`properly rewrites the AST for ${scenario}`, () => {
  //     assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
  //   })
  // }
})
