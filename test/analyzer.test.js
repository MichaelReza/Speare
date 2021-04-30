import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"


const semanticChecks = [
  [
    "variable declarations",
    "alloweth Numeral x be 1\
    alloweth ToBeOrNotToBe y be fallacious",
  ],
  [
    "increment and decrement",
    "alloweth Numeral x be 1 \
    x incrementby 2 \
    x increment \
    x incrementby 5",
  ],
  ["initialize with nonempty array", "alloweth Liste of Numeral n be [5, 8]"],
  ["function declaration", "enter ToBeOrNotToBe foo( Numeral f ) {}"],
  [
    "assign arrays",
    "alloweth Numeral xcontext be 0 \
   alloweth Numeral y be 2 \
   alloweth Numeral z be 1 \
   alloweth Liste of Numeral w be [6, 4, 5, 4, 3] \
   alloweth Liste of ToBeOrNotToBe a be [fallacious, fallacious, faithful] \
   alloweth Liste of Numeral x be [xcontext, y without z]",
  ],
  ["long return", "enter ToBeOrNotToBe foo(Numeral f) { returneth faithful }"],
  [
    "return in nested if",
    "enter ToBeOrNotToBe foo(Numeral f) { whether (faithful) { returneth } }",
  ],
  ["break in nested if", "whilst(fallacious) { whether (faithful) { exit } }"],
  ["long if", "whether (faithful) { speaketh(1) } otherwise {speaketh(3) }"],
  [
    "else if",
    "whether (faithful) { speaketh(1)} subsequently (faithful) { speaketh(0) } subsequently(fallacious) { speaketh(1) } subsequently(fallacious) { speaketh(2) } otherwise {speaketh(3) }",
  ],
  [
    "for in range",
    "in regards to (alloweth Numeral x be 0, x lesser 15, x increment) { speaketh(x) }",
  ],
  [
    "nested for in range",
    "in regards to (alloweth Numeral i be 0, i lesser 15, i increment) { \
     in regards to (alloweth Numeral j be 0, j lesser 15, j increment) { \
       speaketh(i with j) \
     }\
   }",
  ],
  [
    "conditionals with ints",
    "whether(faithful) { speaketh(5) } otherwise { speaketh(6) }",
  ],
  [
    "conditionals with floats",
    "whether(1.2 lesser 1.6) { speaketh(5.6) } otherwise {speaketh(6.1) }",
  ],
  [
    "conditionals with strings",
    'whether(1 lesser 6) { speaketh("hello") } otherwise {speaketh("Goodbye") }',
  ],
  [
    "OR",
    "speaketh(faithful alternatively 1 lesser 2 alternatively fallacious alternatively faithful)",
  ],
  [
    "AND",
    "speaketh(faithful furthermore faithful furthermore fallacious tis not fallacious furthermore faithful)",
  ],
  [
    "relations",
    'speaketh(1 tis lesser 2 furthermore "x" nobler "y" furthermore 3.5 tis lesser 1.2)',
  ],
  ["ok to == arrays", "speaketh([1] tis [5,8])"],
  ["ok to != arrays", "speaketh([1] tis not [5,8])"],
  ["arithmetic", "speaketh(5 exponentiate -3)"],
  [
    "variables",
    "alloweth Liste of Liste of Liste of Liste of Numeral x be [[[[1]]]]",
  ],
  [
    "variable assignment",
    "alloweth Numeral x be 9 \
     alloweth Numeral y be x \
     y be 8",
  ],
  [
    "nested structs",
    'alloweth Concordance of Lexicographical and Numeral c be {"z": 1}\
    alloweth Concordance of Lexicographical and Concordance of Lexicographical and Numeral b be {"y": c}\
    alloweth Concordance of Lexicographical and Concordance of Lexicographical and Concordance of Lexicographical and Numeral a be {"x": b}\
    speaketh(a."x"."y"."z")',
  ],
  [
    "subscript dict",
    'alloweth Concordance of Lexicographical and Numeral y be {"x": 5} speaketh(y."x")',
  ],
  ["subscript liste", "alloweth Liste of Numeral a be [1,2] speaketh(a[0])"],
  [
    "array of corollary",
    'alloweth Liste of Concordance of Lexicographical and Numeral S be [{"x": 1}, {"y": 1}]',
  ],
  [
    "corollary of Listes",
    'alloweth Concordance of Lexicographical and Liste of Numeral S be {"x": [1,2,3]}',
  ],
  [
    "empty corollary of Listes",
    'alloweth Concordance of Lexicographical and Numeral S be {}',
  ],
  [
    "empty corollary of Listes",
    'alloweth Concordance of Liste of Numeral and Numeral S be {[4, 5, 6] : 5}',
  ],
  [
    "concordance parameters",
    "alloweth Concordance of Numeral and Numeral S be {5 : 12}\nenter ToBeOrNotToBe fun(Concordance of Numeral and Numeral x) {}",
  ],
  ["diff type array elements",
    "speaketh([3,3.0])"
  ]
]


const semanticErrors = [
  [
    "non-distinct fields",
    'alloweth Concordance of Lexicographical and Numeral S be {"x": 1, "x": 2}',
    /Keys must be distinct/,
  ],
  ["Class creation", "Composition foo {}", /Compositions cannot be analyzed/],
  ["non-int increment", "alloweth Numeral x be fallacious x increment", /Variable initialized is not the same as declared type/],
  ["non-int decrement", 'alloweth Lexicographical x be "hello" x increment', /Expected a number/],
  ["undeclared id", "speaketh(x)", /Identifier x not declared/],
  [
    "redeclared id",
    "alloweth Numeral x be 1 alloweth Numeral x be 1",
    /Identifier x already declared/,
  ],
  [
    "assign bad type",
    "alloweth Numeral x be faithful",
    /Variable initialized is not the same as declared type/,
  ],
  [
    "bad type variable assignment",
    "alloweth Numeral y be 8 \
     y be faithful",
     /Variable reassignment statement has incompatible types/
  ],
  [
    "assign bad array type",
    "alloweth Liste of Numeral x be [faithful]",
    /Variable initialized is not the same as declared type/,
  ],
  ["break outside loop", "exit", /Exit can only appear in a loop/],
  [
    "break inside function",
    "enter Indistinguishable exe() {exit}\
    whilst(faithful){exe()}",
    /Exit can only appear in a loop/,
  ],
  [
    "return outside function",
    "returneth",
    /Returneth can only appear in a function/,
  ],
  [
    "return value from void function",
    "enter Indistinguishable f() {returneth 1}",
    /Expected return of type Indistinguishable and instead got return type Numeral./,
  ],
  [
    "return nothing from non-void",
    "enter Numeral f(){ returneth }",
    /should be returned here/,
  ],
  [
    "return type mismatch",
    "enter Numeral f(){returneth fallacious}",
    /Expected return of type Numeral and instead got return type ToBeOrNotToBe./,
  ],
  [
    "non-boolean short if test",
    "whether (1) {}",
    /Expected a boolean, found Numeral/,
  ],
  [
    "non-boolean if test",
    "whether (1) {} otherwise {}",
    /Expected a boolean, found Numeral/,
  ],
  ["non-boolean while test", "whilst (1) {}", /Expected a boolean, found Numeral/],
  [
    "non-boolean conditional test",
    "whether (1) {}",
    /Expected a boolean, found Numeral/,
  ],
  [
    "diff types in conditional arms",
    "whether (x be 5) { x be fallacious } ",
    /Expected /,
  ],
  [
    "bad types for ||",
    "speaketh(fallacious alternatively 1) ",
    /Operands do not have the same type/,
  ],
  [
    "bad types for and",
    "speaketh(fallacious furthermore 1)",
    /Operands do not have the same type/,
  ],
  [
    "bad types for ==",
    "speaketh(fallacious tis 1)",
    /Operands do not have the same type/,
  ],
  [
    "bad types for !=",
    "speaketh(fallacious tis 1) ",
    /Operands do not have the same type/,
  ],
  [
    "bad types for +",
    "speaketh(fallacious with 1)",
    /number or string, found ToBeOrNotToBe/,
  ],
  [
    "bad types for -",
    "speaketh(fallacious without 1) ",
    /a number, found ToBeOrNotToBe/,
  ],
  [
    "bad types for *",
    "speaketh(fallacious accumulate 1) ",
    /a number, found ToBeOrNotToBe/,
  ],
  [
    "bad types for /",
    "speaketh(fallacious sunder 1) ",
    /a number, found ToBeOrNotToBe/,
  ],
  [
    "bad types for **",
    "speaketh(fallacious exponentiate 1) ",
    /a number, found ToBeOrNotToBe/,
  ],
  [
    "bad types for <",
    "speaketh(fallacious lesser 1) ",
    /number or string, found ToBeOrNotToBe/,
  ],
  [
    "bad types for <=",
    "speaketh(fallacious tis lesser 1) ",
    /number or string, found ToBeOrNotToBe/,
  ],
  [
    "bad types for >",
    "speaketh(fallacious nobler 1) ",
    /number or string, found ToBeOrNotToBe/,
  ],
  [
    "bad types for >=",
    "speaketh(fallacious tis nobler 1) ",
    /number or string, found ToBeOrNotToBe/,
  ],
  ["bad types for ==", "speaketh(2 tis fallacious) ", /not have the same type/],
  [
    "bad types for !=",
    "speaketh(fallacious tis not 1) ",
    /not have the same type/,
  ],
  [
    "bad types for negation",
    "speaketh(nay([1,2,3]))",
    /Expected a boolean/,
  ],
  [
    "bad types for not",
    'speaketh(nay("hello"))',
    /Expected a boolean/,
  ],
  [
    "non-integer index",
    "alloweth Liste of Numeral a be [1] speaketh(a[fallacious])",
    /Expected a number/,
  ],
  [
    "diff type array elements",
    "speaketh([3,faithful])",
    /Not all elements have the same type/,
  ],
  [
    "shadowing",
    "alloweth Numeral x be 1 \
                whilst (faithful) { \
                  alloweth Numeral  x be 1 \
                }",
    /Identifier x already declared/,
  ],
  [
    "call of uncallable",
    "alloweth Numeral x be 1\
    speaketh(x())",
    /Call of non-function/,
  ],
  [
    "Too many args",
    "enter Numeral f(Numeral x) {\
      returneth x\
    }\
    f(1,2)",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Wrong return value",
    "enter Numeral f(Numeral x) {\
      returneth \"wrong\" \
    }\
    f(1)",
    /Expected return of type Numeral and instead got return type Lexicographical/,
  ],
  [
    "Too few args",
    "enter Indistinguishable f(Numeral x) {}\nf()",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "enter ToBeOrNotToBe f(Numeral x) {}\
     f(fallacious)",
    /Cannot assign a ToBeOrNotToBe to Numeral x/,
  ],
  [
    "function type mismatch",
    `enter Numeral f(Numeral x, ToBeOrNotToBe y) { returneth 1 }
     enter Numeral g() { returneth 5 }
     f(2, g())`,
    /Cannot assign a Numeral to ToBeOrNotToBe y/,
  ],
  [
    "Non-type in param",
    "alloweth Numeral x be 1\
    enter Indistinguishable f(Numeral x, y){}",
    /Expected "Corollary", "Ideogram", "Illused", "Lexicographical", "Numeral", "ToBeOrNotToBe", "Indistinguishable", "Concordance of ", or "Liste of "/,
  ],
  [
    "Non-type in return type",
    "alloweth Numeral x be 1\
    enter Indistinguishable f(){returneth x}",
    /Expected return of type Indistinguishable and instead got return type Numeral/,
  ],
  [
    "Non-type in field type",
    "alloweth Numeral x be 1\
    alloweth Concordance S be {y:x}",
    /Expected "Corollary"/,
  ],
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
})