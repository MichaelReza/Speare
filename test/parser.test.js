import assert from "assert"
import parse from "../src/parser.js"
import util from "util"

const source = `speaketh("hello")
  speaketh(6 with 7)
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

  enter ToBeOrNotToBe foo(Numeral f) {
    in regards to(f within z) {
      in regards to (g within z) {
        g be 6
      }
      f be 7
    }
    returneth f
  }

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

  trigger x {
    condition 0:
      speaketh(x)
      exit
    condition 1:
      speaketh(x)
      exit
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
      Composition bar {
      }
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

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#8,#10,#15,#18,#22,#26,#28,#34,#45,#49,#55,#61,#62,#64,#71,#113,#120,#132]
   2 | Print expression=#3
   3 | StringValue value='hello'
   4 | Print expression=#5
   5 | BinaryExpression left=#6 op='with' right=#7
   6 | Numeral value=6
   7 | Numeral value=7
   8 | VariableInitialization type='Numeral' name='x' initializer=#9
   9 | Numeral value=6
  10 | VariableInitialization type='Numeral' name='qwerty' initializer=#11
  11 | BinaryExpression left=#12 op=undefined right=undefined
  12 | BinaryExpression left=#13 op='without' right=#14
  13 | Numeral value=47
  14 | Numeral value=14
  15 | VariableInitialization type='Numeral' name='yuiop' initializer=#16
  16 | UnaryExpression sign='nay' value=#17
  17 | Numeral value=27
  18 | Print expression=#19
  19 | BinaryExpression left=#20 op='furthermore' right=#21
  20 | IdentifierExpression name='x'
  21 | IdentifierExpression name='y'
  22 | VariableInitialization type='Numeral' name='x' initializer=#23
  23 | BinaryExpression left=#24 op='exponentiate' right=#25
  24 | Numeral value=6
  25 | Numeral value=2
  26 | VariableInitialization type='Numeral' name='y' initializer=#27
  27 | Numeral value=6.33
  28 | VariableInitialization type='Liste of Numeral' name='z' initializer=#29
  29 | Liste values=[#30,#31,#32,#33]
  30 | Numeral value=3
  31 | Numeral value=5
  32 | Numeral value=7
  33 | Numeral value=9
  34 | VariableInitialization type='Concordance of Numeral and Numeral' name='a' initializer=#35
  35 | Concordance dictEntries=[#36,#39,#42]
  36 | DictItem key=#37 val=#38
  37 | Numeral value=12
  38 | Numeral value=6
  39 | DictItem key=#40 val=#41
  40 | Numeral value=3
  41 | Numeral value=4
  42 | DictItem key=#43 val=#44
  43 | Numeral value=8
  44 | Numeral value=9
  45 | Print expression=#46
  46 | BinaryExpression left=#47 op='accumulate' right=#48
  47 | IdentifierExpression name='x'
  48 | Numeral value=5
  49 | VariableAssignment name='x' value=#50
  50 | BinaryExpression left=#51 op='without' right=#54
  51 | BinaryExpression left=#52 op='with' right=#53
  52 | IdentifierExpression name='x'
  53 | Numeral value=5
  54 | Numeral value=6
  55 | VariableAssignment name='x' value=#56
  56 | BinaryExpression left=#57 op='sunder' right=#60
  57 | BinaryExpression left=#58 op='accumulate' right=#59
  58 | IdentifierExpression name='x'
  59 | Numeral value=6
  60 | Numeral value=12
  61 | IncDec name='x' op='increment'
  62 | IncDecby name='x' op='incrementby' expression=#63
  63 | Numeral value=4
  64 | Corollary type='ToBeOrNotToBe' id='foo' params=[#65] body=[#66,#70]
  65 | Param type=null varname='f'
  66 | Array 0=#67
  67 | ForIn _for='in regards to' var1=#68 _in=#69 var2=[] body=undefined brk=undefined
  68 | IdentifierExpression name='f'
  69 | IdentifierExpression name='z'
  70 | Return expression='f'
  71 | Array 0=#72 1=#76 2=#87 3=#103
  72 | WhileLoop whle='whilst' logicExp=[#73] body=[] brk=undefined
  73 | BinaryExpression left=#74 op='nobler' right=#75
  74 | IdentifierExpression name='x'
  75 | Numeral value=20
  76 | DoWhile doo='execute' body=[#77] brk='' whle='whilst' logExp=[#84]
  77 | Array 0=#78
  78 | DoWhile doo='execute' body=[#79] brk='' whle='whilst' logExp=[#81]
  79 | Print expression=#80
  80 | IdentifierExpression name='x'
  81 | BinaryExpression left=#82 op='nobler' right=#83
  82 | IdentifierExpression name='x'
  83 | IdentifierExpression name='x'
  84 | BinaryExpression left=#85 op='nobler' right=#86
  85 | IdentifierExpression name='x'
  86 | IdentifierExpression name='x'
  87 | IfStatement _if='whether' le1=[#88] body=[#91] _elif='subsequently( x nobler x ) {\n    speaketh(x)\n  }' le2=[#93] body2=[#97] _else='otherwise {\n    speaketh(x)\n  }' body3=[#100]
  88 | BinaryExpression left=#89 op='nobler' right=#90
  89 | IdentifierExpression name='x'
  90 | IdentifierExpression name='x'
  91 | Print expression=#92
  92 | IdentifierExpression name='x'
  93 | Array 0=#94
  94 | BinaryExpression left=#95 op='nobler' right=#96
  95 | IdentifierExpression name='x'
  96 | IdentifierExpression name='x'
  97 | Array 0=#98
  98 | Print expression=#99
  99 | IdentifierExpression name='x'
 100 | Array 0=#101
 101 | Print expression=#102
 102 | IdentifierExpression name='x'
 103 | SwitchStatement swtch='trigger' factor1=#104 cse='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit' factor2=[#105,#106] body=[#107,#110] brk='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit'
 104 | IdentifierExpression name='x'
 105 | Numeral value=0
 106 | Numeral value=1
 107 | Array 0=#108
 108 | Print expression=#109
 109 | IdentifierExpression name='x'
 110 | Array 0=#111
 111 | Print expression=#112
 112 | IdentifierExpression name='x'
 113 | Corollary type='ToBeOrNotToBe' id='foo' params=[#114] body=[#115,#117]
 114 | Param type=null varname='b'
 115 | VariableInitialization type='Numeral' name='c' initializer=#116
 116 | Numeral value=1
 117 | Corollary type='ToBeOrNotToBe' id='bar' params=[] body=[#118]
 118 | Print expression=#119
 119 | StringValue value='hello'
 120 | Composition id='foo' compBody=[#121,#126,#127]
 121 | Corollary type='ToBeOrNotToBe' id='foo' params=[#122] body=[#123,#125]
 122 | Param type=null varname='b'
 123 | VariableInitialization type='Numeral' name='c' initializer=#124
 124 | Numeral value=1
 125 | Return expression='c'
 126 | Composition id='bar' compBody=[]
 127 | Corollary type='ToBeOrNotToBe' id='foo' params=[#128] body=[#129,#131]
 128 | Param type=null varname='b'
 129 | VariableInitialization type='Numeral' name='c' initializer=#130
 130 | Numeral value=1
 131 | Return expression='c'
 132 | Array 0=#133
 133 | ForLoop _for='in regards to' s1=#134 s2=#136 s3=[#139] body=[] brk=undefined
 134 | VariableInitialization type='Numeral' name='d' initializer=#135
 135 | Numeral value=0
 136 | BinaryExpression left=#137 op='nobler' right=#138
 137 | IdentifierExpression name='d'
 138 | Numeral value=20
 139 | IncDec name='d' op='decrement'`

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
  "Recognizes for-in loops": "in regards to(x within y) { x be foo }",
  "Recognizes nested for-in loops":
    "in regards to(x within y) { \
        in regards to (y within z) { \
          y be bar \
        } \
      x be foo }",

  // While Loops:
  "Recognizes basic while loop":
    "whilst (x nobler 20) { \
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
  "Recognizes Switch-case statement":
    "trigger x { condition 0: speaketh(z) condition 1: speaketh(y) }",
  "Recognizes Switch-case with break":
    "trigger x { condition 0: speaketh(z) exit condition 1: speaketh(y) exit }",
}

const badPrograms = [
  // Printing:
  [
    "Disallows printing logical statements",
    "sayeth(6 with 7 alternatively 6 with 8)",
    /Line 1, col 7:/,
  ],
  ["Disallows saying type names", "sayeth(Numeral)", /Line 1, col 7:/],
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

  // IF-statements:
  [
    "Disallows if-else-then",
    "whether (x) { speaketh(x) } otherwise { speaketh(y) } subsequently(y) {speaketh(x) }",
    /Line 1, col 55:/,
  ],

  // Switch-Case Statements:
  ["Disallows switch with no cases", "trigger x { }", /Line 1, col 13:/],
  // Types:
  [
    "Disallows incomplete statement",
    "alloweth increment be",
    /Line 1, col 10:/,
  ],
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
