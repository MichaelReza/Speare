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

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#8,#10,#15,#18,#22,#26,#28,#34,#45,#49,#55,#61,#62,#64,#79,#128,#135,#147]
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
  64 | Corollary type='ToBeOrNotToBe' id='foo' params=[#65] body=[#66,#78]
  65 | Param type=null varname='f'
  66 | Array 0=#67
  67 | ForIn _for='in regards to' var1=#68 _in='within' var2=#69 body=[#70,#76]
  68 | IdentifierExpression name='f'
  69 | IdentifierExpression name='z'
  70 | Array 0=#71
  71 | ForIn _for='in regards to' var1=#72 _in='within' var2=#73 body=[#74]
  72 | IdentifierExpression name='g'
  73 | IdentifierExpression name='z'
  74 | VariableAssignment name='g' value=#75
  75 | Numeral value=6
  76 | VariableAssignment name='f' value=#77
  77 | Numeral value=7
  78 | Return expression='f'
  79 | Array 0=#80 1=#91 2=#102 3=#118
  80 | WhileLoop whle='whilst' logicExp=[#81] body=[#84]
  81 | BinaryExpression left=#82 op='nobler' right=#83
  82 | IdentifierExpression name='x'
  83 | Numeral value=20
  84 | Array 0=#85
  85 | WhileLoop whle='whilst' logicExp=[#86] body=[#89]
  86 | BinaryExpression left=#87 op='nobler' right=#88
  87 | IdentifierExpression name='x'
  88 | Numeral value=20
  89 | Print expression=#90
  90 | StringValue value='nested'
  91 | DoWhile doo='execute' body=[#92] whle='whilst' logExp=[#99]
  92 | Array 0=#93
  93 | DoWhile doo='execute' body=[#94] whle='whilst' logExp=[#96]
  94 | Print expression=#95
  95 | IdentifierExpression name='x'
  96 | BinaryExpression left=#97 op='nobler' right=#98
  97 | IdentifierExpression name='x'
  98 | IdentifierExpression name='x'
  99 | BinaryExpression left=#100 op='nobler' right=#101
 100 | IdentifierExpression name='x'
 101 | IdentifierExpression name='x'
 102 | IfStatement _if='whether' le1=[#103] body=[#106] _elif='subsequently( x nobler x ) {\n    speaketh(x)\n  }' le2=[#108] body2=[#112] _else='otherwise {\n    speaketh(x)\n  }' body3=[#115]
 103 | BinaryExpression left=#104 op='nobler' right=#105
 104 | IdentifierExpression name='x'
 105 | IdentifierExpression name='x'
 106 | Print expression=#107
 107 | IdentifierExpression name='x'
 108 | Array 0=#109
 109 | BinaryExpression left=#110 op='nobler' right=#111
 110 | IdentifierExpression name='x'
 111 | IdentifierExpression name='x'
 112 | Array 0=#113
 113 | Print expression=#114
 114 | IdentifierExpression name='x'
 115 | Array 0=#116
 116 | Print expression=#117
 117 | IdentifierExpression name='x'
 118 | SwitchStatement swtch='trigger' factor1=#119 cse='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit' factor2=[#120,#121] body=[#122,#125]
 119 | IdentifierExpression name='x'
 120 | Numeral value=0
 121 | Numeral value=1
 122 | Array 0=#123 1=null
 123 | Print expression=#124
 124 | IdentifierExpression name='x'
 125 | Array 0=#126 1=null
 126 | Print expression=#127
 127 | IdentifierExpression name='x'
 128 | Corollary type='ToBeOrNotToBe' id='foo' params=[#129] body=[#130,#132]
 129 | Param type=null varname='b'
 130 | VariableInitialization type='Numeral' name='c' initializer=#131
 131 | Numeral value=1
 132 | Corollary type='ToBeOrNotToBe' id='bar' params=[] body=[#133]
 133 | Print expression=#134
 134 | StringValue value='hello'
 135 | Composition id='foo' compBody=[#136,#141,#142]
 136 | Corollary type='ToBeOrNotToBe' id='foo' params=[#137] body=[#138,#140]
 137 | Param type=null varname='b'
 138 | VariableInitialization type='Numeral' name='c' initializer=#139
 139 | Numeral value=1
 140 | Return expression='c'
 141 | Composition id='bar' compBody=[]
 142 | Corollary type='ToBeOrNotToBe' id='foo' params=[#143] body=[#144,#146]
 143 | Param type=null varname='b'
 144 | VariableInitialization type='Numeral' name='c' initializer=#145
 145 | Numeral value=1
 146 | Return expression='c'
 147 | Array 0=#148
 148 | ForLoop _for='in regards to' s1=#149 s2=#151 s3=#154 body=[#155]
 149 | VariableInitialization type='Numeral' name='d' initializer=#150
 150 | Numeral value=0
 151 | BinaryExpression left=#152 op='nobler' right=#153
 152 | IdentifierExpression name='d'
 153 | Numeral value=20
 154 | IncDec name='d' op='decrement'
 155 | Array 0=#156
 156 | ForLoop _for='in regards to' s1=#157 s2=#159 s3=#162 body=[#163]
 157 | VariableInitialization type='Numeral' name='e' initializer=#158
 158 | Numeral value=0
 159 | BinaryExpression left=#160 op='nobler' right=#161
 160 | IdentifierExpression name='e'
 161 | Numeral value=20
 162 | IncDec name='e' op='decrement'
 163 | Print expression=#164
 164 | StringValue value='nested'`

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
