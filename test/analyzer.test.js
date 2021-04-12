import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

// Programs that are semantically correct
const semanticChecks = [
  [ // [1] DONE
    "variable declarations",
    "alloweth Numeral x be 1",
    "alloweth ToBeOrNotToBe y be fallacious",
  ],
  [ // [2] DONE
    "increment and decrement",
    "alloweth Numeral x be 1 \
    x incrementby 2 \
    x increment \
    x incrementby 5",
  ],
  // [3] DONE
  ["initialize with nonempty array", "alloweth Liste of Numeral n be [5, 8]"],
  // [4] DONE
  ["function declaration",
  "enter ToBeOrNotToBe foo( Numeral f ) {}"
  ],
  // [5] DONE
  ["assign arrays",
  " \
   alloweth Numeral xcontext be 0 \
   alloweth Numeral y be 2 \
   alloweth Numeral z be 1 \
   alloweth Liste of Numeral w be [6, 4, 5, 4, 3] \
   alloweth Liste of ToBeOrNotToBe a be [fallacious, fallacious, faithful] \
   alloweth Liste of Numeral x be [xcontext, y without z]"
  ],
  // [6] DONE
  ["short return",
  "enter ToBeOrNotToBe foo(Numeral f) { returneth }"
  ],
  // [7] DONE
  ["long return",
  "enter ToBeOrNotToBe foo(Numeral f) { returneth faithful }"
  ],
  // [8] DONE
  ["return in nested if",
   "enter ToBeOrNotToBe foo(Numeral f) { whether (faithful) { returneth } }"
  ],

  // [9] TODO
  ["break in nested if",
  "whilst(fallacious) { whether (faithful) { exit } }"
  ],

  // [10] DONE
  ["long if",
  "whether (faithful) { speaketh(1) } otherwise {speaketh(3) }"
  ],

  // [11] DONE
  ["else if",
  "whether (faithful) { speaketh(1) } subsequently(faithful) { speaketh(0) } otherwise { speaketh(3) }"
  ],

  // [12] TODO
  ["for over collection",
  "in regards to(alloweth Numeral x be x within [3, 4, 5, 6]) { speaketh(x) }"
  ],
  // [13] TODO
  ["for in range",
  "in regards to (Numeral x be 0, x lesser 15, x increment) { speaketh(x) }"
  ],
  // [14] TODO
  ["conditionals with ints",
  "speaketh(whether(true) { speaketh(5) } otherwise {speaketh(6) } )"
  ],
  // [15] TODO
  ["conditionals with floats",
  "speaketh(whether(1.2 lesser 1.6) { speaketh(5.6) } otherwise {speaketh(6.1) } )"
  ],

  // [16] DONE
  ["conditionals with strings",
  "whether(1 lesser 6) { speaketh(\"hello\") } otherwise {speaketh(\"Goodbye\") }"
  ],
  // [17] DONE
  ["OR",
  "speaketh(faithful alternatively 1 lesser 2 alternatively fallacious alternatively faithful)"
  ],

  // [18] TODO
  ["AND",
  "speaketh(faithful furthermore 1 furthermore 2 furthermore fallacious furthermore tis not true)"
  ],
  // [19] TODO
  ["relations",
  'speaketh(1 tis lesser 2 furthermore "x" nobler "y" furthermore 3.5 tis lesser 1.2)'
  ],
  // [20] TODO
  ["ok to == arrays",
  "speaketh([1] tis [5,8])"
  ],
  // [21] TODO
  ["ok to != arrays",
  "speaketh([1] tis not [5,8])"
  ],
  // [22] TODO
  ["arithmetic",
  "alloweth Numeral x be 1 \
  speaketh(2 accumulate 3 with 5 exponentiate nay(3) sunder 2 without 5 residue 8)"
  ],
  // [23] TODO
  ["variables", "alloweth Liste x be [[[[1]]]] speaketh(x[0][0][0][0] with 2)"],
  // [24] TODO: REWRITE THIS GARBAGE
  ["recursive structs", "struct S {z: S?} let x = S(no S)"],
  // [25] TODO: REWRITE THIS GARBAGE
  ["nested structs", "struct T{y:int} struct S{z: T} let x=S(T(1)) speaketh(x.z.y)"],
  // [26] TODO: REWRITE THIS GARBAGE
  ["member exp", "struct S {x: int} let y = S(1)speaketh(y.x)"],
  // [27] TODO: REWRITE THIS GARBAGE
  ["subscript exp", "let a=[1,2]speaketh(a[0])"],
  // [28] TODO: REWRITE THIS GARBAGE
  ["array of struct", "struct S{} let x=[S(), S()]"],
  // [29] TODO: REWRITE THIS GARBAGE
  ["struct of arrays and opts", "struct S{x: [int] y: string??}"],
  // [30] TODO: REWRITE THIG GARBAGE
  ["assigned functions", "function f() {}\nlet g = fg = f"],
  // [31] TODO
  ["call of assigned functions", "enter Numeral f(Numeral x) {}\nalloweth Numeral g be f g(1)"],
  // [32] TODO
  [
    "call of assigned function in expression",
    `enter Indistinguishable f(Numeral x, ToBeOrNotToBe y) {}
    alloweth Enter g be f
    speaketh(g(1, true))
    f be g // Type check here`,
  ],
  // [33] TODO
  [
    "pass a function to a function",
    `enter Numeral f(Numeral x, ToBeOrNotToBe y) { returneth 1 }
     enter Indistinguishable g(ToBeOrNotToBe z) {}
     f(2, g)`,
  ],
  // [34] TODO
  [
    "function return types",
    `enter Numeral square(Numeral x) { returneth x accumulate x }
     enter Numeral compose() { returneth square }`,
  ],
  // [35] TODO
  ["struct parameters", "struct S {} function f(x: S) {}"],
  // [36] TODO
  ["array parameters", "enter Indistinguishable f(Numeral? x) {}"],
  // [37] TODO
  ["optional parameters", "enter Indistinguishable f(Numeral x, Lexicographical? y) {}"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  // [38] TODO: REWRITE THIS GARBAGE
  ["non-distinct fields", "struct S {x: boolean x: int}", /Fields must be distinct/],
  // [39] TODO
  ["non-int increment", "alloweth Numeral x be fallacious x increment", /an integer, found boolean/],
  // [40] TODO: REWRITE THIS GARBAGE
  ["non-int decrement", 'alloweth Numeral x = Lexicographical("")x++', /an integer, found [string]?/], //TO-DO bc some[""] is optional and I am confused
  
  // [41] DONE
  ["undeclared id", "speaketh(x)", /Identifier x not declared/],
  // [42] DONE
  ["redeclared id", "alloweth Numeral x be 1 alloweth Numeral x be 1", /Identifier x already declared/],
  
  // [43] TODO
  ["assign bad type", "alloweth Numeral x be faithful", /Cannot assign a boolean to a int/],
  // [44] TODO
  ["assign bad array type", "alloweth Numeral x be 1 alloweth Liste x be [true]", /Cannot assign a \[boolean\] to a int/],
  // [45] TODO
  ["break outside loop", "exit", /Break can only appear in a loop/],
  // [46] TODO
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
  ["return type mismatch", "enter Numeral f(){returneth fallacious}", /boolean to a int/],
  // [51] TODO
  ["non-boolean short if test", "whether (1) {}", /a boolean, found int/],
  // [52] TODO
  ["non-boolean if test", "whether (1) {} otherwise {}", /a boolean, found int/],
  // [53] TODO
  ["non-boolean while test", "whilest (1) {}", /a boolean, found int/],
  // [54] TODO
  ["non-integer range", "in regards to (i within faithful){}", /an integer, found boolean/],
  // [55] TODO
  ["non-array in for", "in regards to(i within 100) {}", /Array expected/],
  // [56] TODO
  ["non-boolean conditional test", "whether (1) {}", /a boolean, found int/],
  // [57] TODO
  ["diff types in conditional arms", "whether (x be 5) { x be fallacious } ", /not have the same type/],
  // [58] TODO
  ["bad types for ||", "speaketh(fallacious alternatively 1) ", /a boolean, found int/],
  // [59] TODO
  ["bad types for and", "speaketh(fallacious furthermore 1) ", /a boolean, found int/],
  
  // [60] DONE
  ["bad types for ==", "speaketh(fallacious tis 1) ", /Operands do not have the same type/],
 // [61] DONE
  ["bad types for !=", "speaketh(fallacious tis 1) ", /Operands do not have the same type/],
  
  // [63] TODO
  ["bad types for +", "speaketh(fallacious with 1) ", /number or string, found boolean/],
  // [64] TODO
  ["bad types for -", "speaketh(fallacious without 1) ", /a number, found boolean/],
  // [65] TODO
  ["bad types for *", "speaketh(fallacious accumulate 1) ", /a number, found boolean/],
  // [66] TODO
  ["bad types for /", "speaketh(fallacious sunder 1) ", /a number, found boolean/],
  // [67] TODO
  ["bad types for **", "speaketh(fallacious exponentiate 1) ", /a number, found boolean/],
  // [68] TODO
  ["bad types for <", "speaketh(fallacious lesser 1) ", /number or string, found boolean/],
  // [69] TODO, NICELY
  ["bad types for <=", "speaketh(fallacious tis lesser 1) ", /number or string, found bool/],
  // [70] TODO
  ["bad types for >", "speaketh(fallacious nobler 1) ", /number or string, found bool/],
  // [71] TODO
  ["bad types for >=", "speaketh(fallacious tis nobler 1) ", /number or string, found bool/],
  // [70] TODO
  ["bad types for ==", "speaketh(2 tis 2.0) ", /not have the same type/],
  
  // [71] DONE
  ["bad types for !=", "speaketh(fallacious tis not 1) ", /not have the same type/],
  
  // [72] TODO
  ["bad types for negation", "speaketh(nay(faithful)) ", /a number, found boolean/],
  // [73] TODO
  ["bad types for length", "speaketh(#fallacious)", /Array expected/],
  // [74] TODO
  ["bad types for not", 'speaketh(nay("hello"))', /a boolean, found string/],
  // [75] TODO
  ["non-integer index", "alloweth a be [1] speaketh(a[fallacious])", /integer, found boolean/],
  // [76] TODO
  ["diff type array elements", "speaketh([3,3.0])", /Not all elements have the same type/],
  // [77] TODO
  ["shadowing", "alloweth x be 1\nwhilest (faithful) {alloweth x be 1}", /Identifier x already declared/],
  // [78] TODO
  ["call of uncallable", "alloweth x be 1\nspeaketh(x())", /Call of non-function/],
  // [79] TODO
  [
    "Too many args",
    "enter Indistinguishable f(Numeral x) {}\nf(1,2)",
    /1 argument\(s\) required but 2 passed/,
  ],
  // [80] TODO
  [
    "Too few args",
    "enter Indistinguishable f(Numeral x) {}\nf()",
    /1 argument\(s\) required but 0 passed/,
  ],
  // [81] TODO
  [
    "Parameter type mismatch",
    "enter f(Numeral x) {}\nf(fallacious)",
    /Cannot assign a boolean to a int/,
  ],
  // [82] TODO
  [
    "function type mismatch",
    `enter f( Numeral x, y: (boolean)->void): int { return 1 }
     enter g(z: boolean): int { return 5 }
     f(2, g)`,
    /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  ],
  // [83] TODO
  ["Non-type in param", "alloweth Numeral x be 1 enter Indistinguishable f(x y){}", /Type expected/],
  // [84] TODO
  ["Non-type in return type", "alloweth Numeral x be 1 enter x f(){returneth 1}", /Type expected/],
  // [85] TODO
  ["Non-type in field type", "alloweth Numeral x be 1struct S {y:x}", /Type expected/],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

// const Int = ast.Type.INT
// const Void = ast.Type.VOID
// const intToVoidType = new ast.FunctionType([Int], Void)

// const varX = Object.assign(new ast.Variable("x", fallacious), { type: Int })

// const letX1 = Object.assign(new ast.VariableDeclaration("x", fallacious, 1n), {
//   variable: varX,
// })
// const assignX2 = new ast.Assignment(varX, 2n)

// const funDeclF = Object.assign(
//   new ast.FunctionDeclaration("f", [new ast.Parameter("x", Int)], Void, []),
//   {
//     function: Object.assign(new ast.Function("f"), {
//       type: intToVoidType,
//     }),
//   }
// )

// const structS = new ast.StructDeclaration("S", [new ast.Field("x", Int)])

// const graphChecks = [
//   ["Variable created & resolved", "let x=1 x=2", [letX1, assignX2]],
//   ["functions created & resolved", "function f(x: int) {}", [funDeclF]],
//   ["field type resolved", "struct S {x: int}", [structS]],
// ]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  // console.log(semanticChecks.length + semanticErrors.length)
  // for (const [scenario, source, errorMessagePattern] of semanticErrors) {
  //   it(`throws on ${scenario}`, () => {
  //     assert.throws(() => analyze(parse(source)), errorMessagePattern)
  //   })
  // }
  // for (const [scenario, source, graph] of graphChecks) {
  //   it(`properly rewrites the AST for ${scenario}`, () => {
  //     assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
  //   })
  // }
})
