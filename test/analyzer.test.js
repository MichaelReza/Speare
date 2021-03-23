  
import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations",
  'alloweth Numeral x be 1 \
  alloweth ToBeOrNotToBe y be fallacious'
  ],
  ["complex array types",
    "alloweth Liste of Liste of Liste of Numeral x be [[[6, 3, 7, 3, 2], [6, 3, 7, 3, 2]], [[6, 3, 7, 3, 2]]]"
  ],
  ["increment and decrement",
    "alloweth Numeral x be x increment 2 \
    x increment \
    x incrementby 5"
  ],
  ["initialize with empty array",
  "alloweth Liste of Numeral n be []"
  ],
  ["function declaration",
  "enter ToBeOrNotToBe foo(Numeral f) {}"
  ],
  ["assign arrays",
  "alloweth Liste of Numeral be [6, 4, 5, 4, 3] \
   alloweth Liste of ToBeOrNotToBe be [fallacious, fallacious, faithful] \
   alloweth Liste of Numeral be [xcontext, y without z]"
  ],
  ["short return",
  "enter ToBeOrNotToBe foo(Numeral f) { returneth }"
  ],
  ["long return",
  "enter ToBeOrNotToBe foo(Numeral f) { returneth faithful }"
  ],
  ["return in nested if",
   "enter ToBeOrNotToBe foo(Numeral f) { whether faithful { returneth } }"
  ],
  ["break in nested if",
  "whilst fallacious { whether faithful { exit } }"
  ],
  ["long if",
  "whether faithful { speaketh(1)} otherwise {speaketh(3) }"
  ],
  ["else if",
  "whether faithful { speaketh(1)} subsequently faithful { speaketh(0) } otherwise {speaketh(3) }"
  ],
  ["for over collection",
  "in regards to(x within y) { speaketh(x) }"
  ],
  ["for in range",
  "in regards to (Numeral x be 0, x lesser 15, x increment) { speaketh(x) }"
  ],
  ["conditionals with ints",
  "speaketh(whether(true) { speaketh(5) } otherwise {speaketh(6) } )"
  ],
  ["conditionals with floats",
  "speaketh(whether(1.2 lesser 1.6) { speaketh(5.6) } otherwise {speaketh(6.1) } )"
  ],
  ["conditionals with strings",
  "speaketh(whether(1 lesser 6) { speaketh(\"hello\") } otherwise {speaketh(\"Goodbye\") } )"
  ],
  ["OR",
  "speaketh(faithful alternatively 1 lesser 2 alternatively fallacious alternatively tis not true)"
  ],
  ["AND",
  "speaketh(faithful furthermore 1 furthermore 2 furthermore fallacious furthermore tis not true)"
  ],
  ["relations",
  'speaketh(1 tis lesser 2 furthermore "x" nobler "y" furthermore 3.5 tis lesser 1.2)'
  ],
  ["ok to == arrays",
  "speaketh([1] tis [5,8])"
  ],
  ["ok to != arrays",
  "speaketh([1] tis not [5,8])"
  ],
  ["arithmetic",
  "alloweth Numeral x be 1 \
  speaketh(2 accumulate 3 with 5 exponentiate nay(3) sunder 2 without 5 residue 8)"
  ],
  ["variables", "let x=[[[[1]]]]; print(x[0][0][0][0]+2);"],
  ["recursive structs", "struct S {z: S?} let x = S(no S);"],
  ["nested structs", "struct T{y:int} struct S{z: T} let x=S(T(1)); print(x.z.y);"],
  ["member exp", "struct S {x: int} let y = S(1);print(y.x);"],
  ["subscript exp", "let a=[1,2];print(a[0]);"],
  ["array of struct", "struct S{} let x=[S(), S()];"],
  ["struct of arrays and opts", "struct S{x: [int] y: string??}"],
  ["assigned functions", "function f() {}\nlet g = f;g = f;"],
  ["call of assigned functions", "function f(x: int) {}\nlet g=f;g(1);"],
  [
    "call of assigned function in expression",
    `function f(x: int, y: boolean): int {}
    let g = f;
    print(g(1, true));
    f = g; // Type check here`,
  ],
  [
    "pass a function to a function",
    `function f(x: int, y: (boolean)->void): int { return 1; }
     function g(z: boolean) {}
     f(2, g);`,
  ],
  [
    "function return types",
    `function square(x: int): int { return x * x; }
     function compose(): (int)->int { return square; }`,
  ],
  ["struct parameters", "struct S {} function f(x: S) {}"],
  ["array parameters", "function f(x: [int?]) {}"],
  ["optional parameters", "function f(x: [int], y: string?) {}"],
  ["built-in constants", "print(25.0 * π);"],
  ["built-in sin", "print(sin(π));"],
  ["built-in cos", "print(cos(93.999));"],
  ["built-in hypot", "print(hypot(-4.0, 3.00001));"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["non-distinct fields", "struct S {x: boolean x: int}", /Fields must be distinct/],
  ["non-int increment", "let x=false;x++;", /an integer, found boolean/],
  ["non-int decrement", 'let x=some[""];x++;', /an integer, found [string]?/],
  ["undeclared id", "print(x);", /Identifier x not declared/],
  ["redeclared id", "let x = 1;let x = 1;", /Identifier x already declared/],
  ["assign to const", "const x = 1;x = 2;", /Cannot assign to constant x/],
  ["assign bad type", "let x=1;x=true;", /Cannot assign a boolean to a int/],
  ["assign bad array type", "let x=1;x=[true];", /Cannot assign a \[boolean\] to a int/],
  ["assign bad optional type", "let x=1;x=some 2;", /Cannot assign a int\? to a int/],
  ["break outside loop", "break;", /Break can only appear in a loop/],
  [
    "break inside function",
    "while true {function f() {break;}}",
    /Break can only appear in a loop/,
  ],
  ["return outside function", "return;", /Return can only appear in a function/],
  [
    "return value from void function",
    "function f() {return 1;}",
    /Cannot return a value here/,
  ],
  [
    "return nothing from non-void",
    "function f(): int {return;}",
    /should be returned here/,
  ],
  ["return type mismatch", "function f(): int {return false;}", /boolean to a int/],
  ["non-boolean short if test", "if 1 {}", /a boolean, found int/],
  ["non-boolean if test", "if 1 {} else {}", /a boolean, found int/],
  ["non-boolean while test", "while 1 {}", /a boolean, found int/],
  ["non-integer repeat", 'repeat "1" {}', /an integer, found string/],
  ["non-integer low range", "for i in true...2 {}", /an integer, found boolean/],
  ["non-integer high range", "for i in 1..<no int {}", /an integer, found int\?/],
  ["non-array in for", "for i in 100 {}", /Array expected/],
  ["non-boolean conditional test", "print(1?2:3);", /a boolean, found int/],
  ["diff types in conditional arms", "print(true?1:true);", /not have the same type/],
  ["unwrap non-optional", "print(1??2);", /Optional expected/],
  ["bad types for ||", "print(false||1);", /a boolean, found int/],
  ["bad types for &&", "print(false&&1);", /a boolean, found int/],
  ["bad types for ==", "print(false==1);", /Operands do not have the same type/],
  ["bad types for !=", "print(false==1);", /Operands do not have the same type/],
  ["bad types for +", "print(false+1);", /number or string, found boolean/],
  ["bad types for -", "print(false-1);", /a number, found boolean/],
  ["bad types for *", "print(false*1);", /a number, found boolean/],
  ["bad types for /", "print(false/1);", /a number, found boolean/],
  ["bad types for **", "print(false**1);", /a number, found boolean/],
  ["bad types for <", "print(false<1);", /number or string, found boolean/],
  ["bad types for <=", "print(false<=1);", /number or string, found bool/],
  ["bad types for >", "print(false>1);", /number or string, found bool/],
  ["bad types for >=", "print(false>=1);", /number or string, found bool/],
  ["bad types for ==", "print(2==2.0);", /not have the same type/],
  ["bad types for !=", "print(false!=1);", /not have the same type/],
  ["bad types for negation", "print(-true);", /a number, found boolean/],
  ["bad types for length", "print(#false);", /Array expected/],
  ["bad types for not", 'print(!"hello");', /a boolean, found string/],
  ["non-integer index", "let a=[1];print(a[false]);", /integer, found boolean/],
  ["no such field", "struct S{} let x=S(); print(x.y);", /No such field/],
  ["diff type array elements", "print([3,3.0]);", /Not all elements have the same type/],
  ["shadowing", "let x = 1;\nwhile true {let x = 1;}", /Identifier x already declared/],
  ["call of uncallable", "let x = 1;\nprint(x());", /Call of non-function/],
  [
    "Too many args",
    "function f(x: int) {}\nf(1,2);",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "function f(x: int) {}\nf();",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "function f(x: int) {}\nf(false);",
    /Cannot assign a boolean to a int/,
  ],
  [
    "function type mismatch",
    `function f(x: int, y: (boolean)->void): int { return 1; }
     function g(z: boolean): int { return 5; }
     f(2, g);`,
    /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  ],
  ["bad call to stdlib sin()", "print(sin(true));", /Cannot assign a boolean to a float/],
  ["Non-type in param", "let x=1;function f(y:x){}", /Type expected/],
  ["Non-type in return type", "let x=1;function f():x{return 1;}", /Type expected/],
  ["Non-type in field type", "let x=1;struct S {y:x}", /Type expected/],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

const Int = ast.Type.INT
const Void = ast.Type.VOID
const intToVoidType = new ast.FunctionType([Int], Void)

const varX = Object.assign(new ast.Variable("x", false), { type: Int })

const letX1 = Object.assign(new ast.VariableDeclaration("x", false, 1n), {
  variable: varX,
})
const assignX2 = new ast.Assignment(varX, 2n)

const funDeclF = Object.assign(
  new ast.FunctionDeclaration("f", [new ast.Parameter("x", Int)], Void, []),
  {
    function: Object.assign(new ast.Function("f"), {
      type: intToVoidType,
    }),
  }
)

const structS = new ast.StructDeclaration("S", [new ast.Field("x", Int)])

const graphChecks = [
  ["Variable created & resolved", "let x=1; x=2;", [letX1, assignX2]],
  ["functions created & resolved", "function f(x: int) {}", [funDeclF]],
  ["field type resolved", "struct S {x: int}", [structS]],
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
  for (const [scenario, source, graph] of graphChecks) {
    it(`properly rewrites the AST for ${scenario}`, () => {
      assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
    })
  }
})