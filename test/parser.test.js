import assert from "assert"
import parse from "../src/parser.js"
import util from "util"

const source = `speaketh("hello")
  speaketh(6 with -7)
  alloweth Numeral x be 6
  alloweth Numeral qwerty be (47 without 14)
  alloweth Numeral yuiop be nay(27)
  speaketh(x furthermore y)
  alloweth Numeral x be 6 exponentiate 2
  alloweth Numeral y be 6.33
  alloweth Liste of Numeral z be [3, 5, 7, 9]
  alloweth Concordance of Numeral and Numeral a be {12 : 6, 3 : 4, 8 : 9}
  speaketh(x accumulate 5)
  x be x with 5 without 6
  x be x accumulate 6 sunder 12
  x increment
  x incrementby 4
  whilst (x nobler 20) {
    whilst (x nobler 20) {
      speaketh("nested")
    }
  }
  execute {
    execute {
      speaketh(x)
    } whilst(x nobler x)
  } whilst(x nobler x)
  whether (x nobler x) {
    speaketh(x)
  }
  subsequently( x nobler x ) {
    speaketh(x)
  }
  otherwise {
    speaketh(x)
  }
  enter ToBeOrNotToBe foo(Numeral b) {
    alloweth Numeral c be 1
    enter ToBeOrNotToBe bar() {
      speaketh("hello")
    }
  }
  Composition foo {
    enter ToBeOrNotToBe foo(Numeral b) {
      alloweth Numeral c be 1
      returneth c
    }
    Composition bar {}
    enter ToBeOrNotToBe foo(Numeral b) {
      alloweth Numeral c be 1
      returneth c
    }
  }
  in regards to (alloweth Numeral d be 0, d nobler 20, d decrement) {
    in regards to (alloweth Numeral e be 0, e nobler 20, e decrement) {
      speaketh("nested")
    }
  }
  `

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#8,#10,#14,#17,#21,#25,#27,#34,#46,#50,#57,#64,#65,#67,#105,#112,#113]
   2 | Print expression=#3
   3 | StringValue value='hello' name='Lexicographical'
   4 | Print expression=#5
   5 | BinaryExpression left=#6 op='with' right=#7
   6 | Numeral value=6 name='Numeral'
   7 | Numeral value=-7 name='Numeral'
   8 | VariableInitialization type='Numeral' name='x' initializer=#9
   9 | Numeral value=6 name='Numeral'
  10 | VariableInitialization type='Numeral' name='qwerty' initializer=#11
  11 | BinaryExpression left=#12 op='without' right=#13
  12 | Numeral value=47 name='Numeral'
  13 | Numeral value=14 name='Numeral'
  14 | VariableInitialization type='Numeral' name='yuiop' initializer=#15
  15 | UnaryExpression sign='nay' value=#16
  16 | Numeral value=27 name='Numeral'
  17 | Print expression=#18
  18 | BinaryExpression left=#19 op='furthermore' right=#20
  19 | IdentifierExpression name='x'
  20 | IdentifierExpression name='y'
  21 | VariableInitialization type='Numeral' name='x' initializer=#22
  22 | BinaryExpression left=#23 op='exponentiate' right=#24
  23 | Numeral value=6 name='Numeral'
  24 | Numeral value=2 name='Numeral'
  25 | VariableInitialization type='Numeral' name='y' initializer=#26
  26 | Numeral value=6.33 name='Numeral'
  27 | VariableInitialization type=#28 name='z' initializer=#29
  28 | ListeType name='[Numeral]' baseType='Numeral'
  29 | Liste values=[#30,#31,#32,#33]
  30 | Numeral value=3 name='Numeral'
  31 | Numeral value=5 name='Numeral'
  32 | Numeral value=7 name='Numeral'
  33 | Numeral value=9 name='Numeral'
  34 | VariableInitialization type=#35 name='a' initializer=#36
  35 | ConcordanceType name='[Numeral:Numeral]' keyType='Numeral' valType='Numeral'
  36 | Concordance type='[Numeral:Numeral]' dictEntries=[#37,#40,#43]
  37 | DictEntry key=#38 val=#39
  38 | Numeral value=12 name='Numeral'
  39 | Numeral value=6 name='Numeral'
  40 | DictEntry key=#41 val=#42
  41 | Numeral value=3 name='Numeral'
  42 | Numeral value=4 name='Numeral'
  43 | DictEntry key=#44 val=#45
  44 | Numeral value=8 name='Numeral'
  45 | Numeral value=9 name='Numeral'
  46 | Print expression=#47
  47 | BinaryExpression left=#48 op='accumulate' right=#49
  48 | IdentifierExpression name='x'
  49 | Numeral value=5 name='Numeral'
  50 | VariableAssignment name=#51 value=#52
  51 | IdentifierExpression name='x'
  52 | BinaryExpression left=#53 op='without' right=#56
  53 | BinaryExpression left=#54 op='with' right=#55
  54 | IdentifierExpression name='x'
  55 | Numeral value=5 name='Numeral'
  56 | Numeral value=6 name='Numeral'
  57 | VariableAssignment name=#58 value=#59
  58 | IdentifierExpression name='x'
  59 | BinaryExpression left=#60 op='sunder' right=#63
  60 | BinaryExpression left=#61 op='accumulate' right=#62
  61 | IdentifierExpression name='x'
  62 | Numeral value=6 name='Numeral'
  63 | Numeral value=12 name='Numeral'
  64 | IncDec name='x' op='increment'
  65 | IncDecby name='x' op='incrementby' expression=#66
  66 | Numeral value=4 name='Numeral'
  67 | Array 0=#68 1=#79 2=#90
  68 | WhileLoop logicExp=[#69] body=[#72]
  69 | BinaryExpression left=#70 op='nobler' right=#71
  70 | IdentifierExpression name='x'
  71 | Numeral value=20 name='Numeral'
  72 | Array 0=#73
  73 | WhileLoop logicExp=[#74] body=[#77]
  74 | BinaryExpression left=#75 op='nobler' right=#76
  75 | IdentifierExpression name='x'
  76 | Numeral value=20 name='Numeral'
  77 | Print expression=#78
  78 | StringValue value='nested' name='Lexicographical'
  79 | DoWhile doo='execute' body=[#80] whle='whilst' logExp=[#87]
  80 | Array 0=#81
  81 | DoWhile doo='execute' body=[#82] whle='whilst' logExp=[#84]
  82 | Print expression=#83
  83 | IdentifierExpression name='x'
  84 | BinaryExpression left=#85 op='nobler' right=#86
  85 | IdentifierExpression name='x'
  86 | IdentifierExpression name='x'
  87 | BinaryExpression left=#88 op='nobler' right=#89
  88 | IdentifierExpression name='x'
  89 | IdentifierExpression name='x'
  90 | IfStatement le1=#91 body=[#94] le2=[#96] body2=[#99] body3=[#102]
  91 | BinaryExpression left=#92 op='nobler' right=#93
  92 | IdentifierExpression name='x'
  93 | IdentifierExpression name='x'
  94 | Print expression=#95
  95 | IdentifierExpression name='x'
  96 | BinaryExpression left=#97 op='nobler' right=#98
  97 | IdentifierExpression name='x'
  98 | IdentifierExpression name='x'
  99 | Array 0=#100
 100 | Print expression=#101
 101 | IdentifierExpression name='x'
 102 | Array 0=#103
 103 | Print expression=#104
 104 | IdentifierExpression name='x'
 105 | Corollary type='ToBeOrNotToBe' id='foo' params=[#106] body=[#107,#109]
 106 | Param type='Numeral' name='b'
 107 | VariableInitialization type='Numeral' name='c' initializer=#108
 108 | Numeral value=1 name='Numeral'
 109 | Corollary type='ToBeOrNotToBe' id='bar' params=[] body=[#110]
 110 | Print expression=#111
 111 | StringValue value='hello' name='Lexicographical'
 112 | Composition id='foo' compBody=[]
 113 | Array 0=#114
 114 | ForLoop init=#115 condition=#117 action=#120 body=[#121]
 115 | ForLoopVariable type='Numeral' name='d' initializer=#116
 116 | Numeral value=0 name='Numeral'
 117 | BinaryExpression left=#118 op='nobler' right=#119
 118 | IdentifierExpression name='d'
 119 | Numeral value=20 name='Numeral'
 120 | ForLoopAction name='d' op='decrement'
 121 | Array 0=#122
 122 | ForLoop init=#123 condition=#125 action=#128 body=[#129]
 123 | ForLoopVariable type='Numeral' name='e' initializer=#124
 124 | Numeral value=0 name='Numeral'
 125 | BinaryExpression left=#126 op='nobler' right=#127
 126 | IdentifierExpression name='e'
 127 | Numeral value=20 name='Numeral'
 128 | ForLoopAction name='e' op='decrement'
 129 | Print expression=#130
 130 | StringValue value='nested' name='Lexicographical'`

const goodPrograms = {
  // Empty Program:
  "Recognizes empty program": "",

  // Printing:
  "Recognizes a simple print statement": 'speaketh("hello")',
  "Recognizes arithmetic print statement": "speaketh(6 with 7)",

  // Variable Declaration:
  "Recognizes declaration of Integer numerals": "alloweth Numeral x be 6",
  "Recognizes declaration of floating point numerals":
    "alloweth Numeral x be 6.3373685",
  "Recognizes declaration of strings": 'alloweth Lexicographical x be "word"',
  "Recognizes declaration of null value": "alloweth Illused x be null",
  "Recognizes declaration of boolean truth":
    "alloweth ToBeOrNotToBe x be faithful",
  "Recognizes declaration of boolean false":
    "alloweth ToBeOrNotToBe x be fallacious",
  "Recognizes declaration of Nonetype":
    "alloweth Indistinguishable x be indistinguishable",
  "Recognizes declaration of Liste":
    "alloweth Liste of Numeral x be [3, 5, 7, 9]",
  "Recognizes declaration of Concordance":
    "alloweth Concordance of Numeral and Numeral x be {12 : 6, 3 : 4, 8 : 9}",
  // Arithmetic:
  "Recognizes a print statement": "speaketh(x accumulate 5)",
  "Recognizes parenthetical addition": "speaketh(x with (5 without 2))",
  "Recognizes arithmetic +-": "x be x with 5 without 6",
  "Recognizes arithmetic */": "y be x accumulate 6 sunder 12",
  "Recognizes decrementation": "x decrement",
  "Recognizes specified decrementation": "x decrementby 4",
  "Recognizes incrememntation": "x increment",
  "Recognizes specified incrememntation": "x incrementby 4",

  // Functions:
  "Recognizes basic functions":
    "enter ToBeOrNotToBe foo(Numeral x) { \
        alloweth Numeral x be 1 \
        returneth x \
    }",
  "Recognizes nested functions":
    'enter ToBeOrNotToBe foo(Numeral x) { \
      alloweth Numeral x be 1 \
      enter ToBeOrNotToBe bar() { \
        speaketh("hello") \
      } \
      returneth x \
    }',
  "Recognizes creation of empty function": "enter Numeral foo(Numeral x) {}",
  // Classes:
  "Recognizes empty class": "Composition foo {}",
  "Recognizes classes":
    "Composition foo { \
    enter ToBeOrNotToBe foo(Numeral x) { \
    alloweth Numeral x be 1 \
    returneth x \
    } \
  }",
  "Recognizes nested classes":
    "Composition foo { \
    Composition bar { \
    } \
    }",
  "Recognizes nested classes in complex configuration":
    "Composition foo { \
    enter ToBeOrNotToBe foo(Numeral x) { \
    alloweth Numeral x be 1 \
    returneth x \
    } \
    Composition bar { \
    } \
    enter ToBeOrNotToBe foo(Numeral x) { \
    alloweth Numeral x be 1 \
    returneth x \
    } \
    }",

  // For loops:
  "Recognizes basic for loop":
    "in regards to (alloweth Numeral x be 0, x nobler 20, x decrement) { \
      speaketh(x) \
    }",
  "Recognizes nested for loop":
    'in regards to (alloweth Numeral x be 0, x nobler 20, x decrement) { \
      in regards to (alloweth Numeral y be 0, y nobler 20, y decrement) { \
        speaketh("nested") \
      } \
    }',
  // While Loops:
  "Recognizes basic while loop":
    "whilst (x nobler 20) { \
      speaketh(x) \
    }",
  "Recognizes while loop with logical op":
    "whilst (2 nobler 1 furthermore 3 lesser 5) { \
      speaketh(x) \
    }",
  "Recognizes nested while loop":
    'whilst (x nobler 20) { \
      whilst (y nobler 20) { \
        speaketh("nested") \
      } \
    }',

  // Do-While Loops:
  "Recognizes basic while loop":
    "execute { \
      speaketh(x) \
    } whilst(x nobler y)",
  "Recognizes nested while loop":
    "execute { \
      execute { \
        speaketh(x) \
      } whilst(y nobler z) \
    } whilst(x nobler y)",

  // IF-statements:
  "Recognizes if statement": "whether (x nobler y) { speaketh(x) }",
  "Recognizes if-else statement":
    "whether (x nobler y) { speaketh(x) } otherwise { speaketh(y) }",
  "Recognizes if-elif-else statement":
    "whether (x nobler y) { speaketh(x) } \
     subsequently(y nobler x) { speaketh(z) } \
     otherwise { speaketh(y) }",

  // Switch-Case Statements:
  // "Recognizes Switch-case statement":
  //   "trigger x { condition 0: speaketh(z) condition 1: speaketh(y) }",
  // "Recognizes Switch-case with break":
  //   "trigger x { condition 0: speaketh(z) exit condition 1: speaketh(y) exit }",
}

const badPrograms = [
  // Printing:
  ["Disallows saying type names", "speaketh(Numeral)", /Line 1, col 10:/],
  // Variable Assignment:
  ["Disallows incomplete statement", "alloweth", /Line 1, col 9:/],
  ["Disallows declaration", "alloweth x", /Line 1, col 10:/],
  [
    "Disallows assignment to keyword",
    "alloweth x be increment",
    /Line 1, col 10:/,
  ],
  [
    "Disallows assignment to decrementation",
    "x be x decrement",
    /Line 1, col 8:/,
  ],
  // Arithmetic:

  // Functions:
  [
    "Disallows non-type function",
    "enter toal foo(Numeral increment) { returneth 0 }",
    /Line 1, col 7:/,
  ],
  [
    "Disallows delcaration of function with no type",
    "enter foo() { returneth 0}",
    /Line 1, col 7:/,
  ],

  // Classes:
  [
    "Disallows mismatched exits between classes",
    'Composition foo { Composition bar } { speaketh("bar") }',
    /Line 1, col 35:/,
  ],

  // For loops:
  [
    "Disallows inadequate statements in for-loop",
    "in regards to( Numeral x be 0) { speaketh(x) }",
    /Line 1, col 16:/,
  ],
  [
    "Disallows improper for-in loop",
    "in regards to( alloweth x be 12) {  speaketh(x) }",
    /Line 1, col 25:/,
  ],

  // While Loops:
  [
    "Disallows improper while loop",
    "whilst( Numeral x be 0) { speaketh(x) }",
    /Line 1, col 9:/,
  ],

  // Do-While Loops:
  [
    "Disallows do loop without while",
    "execute{alloweth x be 12}",
    /Line 1, col 18:/,
  ],
  // Do-While Loops:
  [
    "Disallows sqitch case",
    "trigger x { \
      condition 1: \
        speaketh(fallacious) \
        exit \
    }",
    /Not implemented/,
  ],

  // IF-statements:
  [
    "Disallows if-else-then",
    "whether (x) { speaketh(x) } otherwise { speaketh(y) } subsequently(y) {speaketh(x) }",
    /Line 1, col 55:/,
  ],

  // Switch-Case Statements:
  // ["Disallows switch with no cases", "trigger x { }", /Line 1, col 13:/],
  // // Types:
  // [
  //   "Disallows incomplete statement",
  //   "alloweth increment be",
  //   /Line 1, col 10:/,
  // ],
]

describe("the Parser", () => {
  // Accepted
  for (const [prompt, code] of Object.entries(goodPrograms)) {
    it(prompt, () => {
      assert.ok(parse(code))
    })
  }

  // Recejcted
  for (const [scenario, source, errorMessagePattern] of badPrograms) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern)
    })
  }

  it("produces the expected AST for all node types", () => {
    assert.deepStrictEqual(util.format(parse(source)), expectedAst)
  })
  // console.log(util.format(parse(source)))
})