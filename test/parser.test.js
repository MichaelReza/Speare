import assert from "assert"
import parse from "../src/parser.js"
import util from "util"

const source =
 `speaketh("hello")
  speaketh(6 with 7)
  alloweth Numeral x be 6
  alloweth Numeral y be 6.33
  alloweth Liste z be [3, 5, 7, 9]
  alloweth Concordance a be {12 : 6, 3 : 4, 8 : 9}
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

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#8,#10,#12,#19,#29,#33,#39,#45,#46,#48,#55,#97,#104,#116]
   2 | Print expression=#3
   3 | StringValue value='hello'
   4 | Print expression=#5
   5 | BinaryExpression left=#6 op='with' right=#7
   6 | Numeral whole='6' decimal='' fract=''
   7 | Numeral whole='7' decimal='' fract=''
   8 | VariableInitialization type='Numeral' name='x' initializer=#9
   9 | Numeral whole='6' decimal='' fract=''
  10 | VariableInitialization type='Numeral' name='y' initializer=#11
  11 | Numeral whole='6' decimal='.33' fract='.33'
  12 | VariableInitialization type='Liste' name='z' initializer=#13
  13 | ArrayType firstValue=[#14] values=[#15]
  14 | Numeral whole='3' decimal='' fract=''
  15 | Array 0=#16 1=#17 2=#18
  16 | Numeral whole='5' decimal='' fract=''
  17 | Numeral whole='7' decimal='' fract=''
  18 | Numeral whole='9' decimal='' fract=''
  19 | VariableInitialization type='Concordance' name='a' initializer=#20
  20 | DictType keyType=[#21] valType=[#22] keys=[#23] values=[#26]
  21 | Numeral whole='12' decimal='' fract=''
  22 | Numeral whole='6' decimal='' fract=''
  23 | Array 0=#24 1=#25
  24 | Numeral whole='3' decimal='' fract=''
  25 | Numeral whole='8' decimal='' fract=''
  26 | Array 0=#27 1=#28
  27 | Numeral whole='4' decimal='' fract=''
  28 | Numeral whole='9' decimal='' fract=''
  29 | Print expression=#30
  30 | BinaryExpression left=#31 op='accumulate' right=#32
  31 | IdentifierExpression name='x'
  32 | Numeral whole='5' decimal='' fract=''
  33 | VariableAssignment name='x' value=#34
  34 | BinaryExpression left=#35 op='without' right=#38
  35 | BinaryExpression left=#36 op='with' right=#37
  36 | IdentifierExpression name='x'
  37 | Numeral whole='5' decimal='' fract=''
  38 | Numeral whole='6' decimal='' fract=''
  39 | VariableAssignment name='x' value=#40
  40 | BinaryExpression left=#41 op='sunder' right=#44
  41 | BinaryExpression left=#42 op='accumulate' right=#43
  42 | IdentifierExpression name='x'
  43 | Numeral whole='6' decimal='' fract=''
  44 | Numeral whole='12' decimal='' fract=''
  45 | IncDec name='x' op='increment'
  46 | IncDecby name='x' op='incrementby' expression=#47
  47 | Numeral whole='4' decimal='' fract=''
  48 | Corollary type='ToBeOrNotToBe' id='foo' params=[#49] body=[#50,#54]
  49 | Param type=null varname='f'
  50 | Array 0=#51
  51 | ForIn _for='in regards to' var1=#52 _in=#53 var2=[] body=undefined brk=undefined
  52 | IdentifierExpression name='f'
  53 | IdentifierExpression name='z'
  54 | Return expression='f'
  55 | Array 0=#56 1=#60 2=#71 3=#87
  56 | WhileLoop whle='whilst' logicExp=[#57] body=[] brk=undefined
  57 | BinaryExpression left=#58 op='nobler' right=#59
  58 | IdentifierExpression name='x'
  59 | Numeral whole='20' decimal='' fract=''
  60 | DoWhile doo='execute' body=[#61] brk='' whle='whilst' logExp=[#68]
  61 | Array 0=#62
  62 | DoWhile doo='execute' body=[#63] brk='' whle='whilst' logExp=[#65]
  63 | Print expression=#64
  64 | IdentifierExpression name='x'
  65 | BinaryExpression left=#66 op='nobler' right=#67
  66 | IdentifierExpression name='x'
  67 | IdentifierExpression name='x'
  68 | BinaryExpression left=#69 op='nobler' right=#70
  69 | IdentifierExpression name='x'
  70 | IdentifierExpression name='x'
  71 | IfStatement _if='whether' le1=[#72] body=[#75] _elif='subsequently( x nobler x ) {\n    speaketh(x)\n  }' le2=[#77] body2=[#81] _else='otherwise {\n    speaketh(x)\n  }' body3=[#84]
  72 | BinaryExpression left=#73 op='nobler' right=#74
  73 | IdentifierExpression name='x'
  74 | IdentifierExpression name='x'
  75 | Print expression=#76
  76 | IdentifierExpression name='x'
  77 | Array 0=#78
  78 | BinaryExpression left=#79 op='nobler' right=#80
  79 | IdentifierExpression name='x'
  80 | IdentifierExpression name='x'
  81 | Array 0=#82
  82 | Print expression=#83
  83 | IdentifierExpression name='x'
  84 | Array 0=#85
  85 | Print expression=#86
  86 | IdentifierExpression name='x'
  87 | SwitchStatement swtch='trigger' factor1=#88 cse='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit' factor2=[#89,#90] body=[#91,#94] brk='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit'
  88 | IdentifierExpression name='x'
  89 | Numeral whole='0' decimal='' fract=''
  90 | Numeral whole='1' decimal='' fract=''
  91 | Array 0=#92
  92 | Print expression=#93
  93 | IdentifierExpression name='x'
  94 | Array 0=#95
  95 | Print expression=#96
  96 | IdentifierExpression name='x'
  97 | Corollary type='ToBeOrNotToBe' id='foo' params=[#98] body=[#99,#101]
  98 | Param type=null varname='b'
  99 | VariableInitialization type='Numeral' name='c' initializer=#100
 100 | Numeral whole='1' decimal='' fract=''
 101 | Corollary type='ToBeOrNotToBe' id='bar' params=[] body=[#102]
 102 | Print expression=#103
 103 | StringValue value='hello'
 104 | Composition id='foo' compBody=[#105,#110,#111]
 105 | Corollary type='ToBeOrNotToBe' id='foo' params=[#106] body=[#107,#109]
 106 | Param type=null varname='b'
 107 | VariableInitialization type='Numeral' name='c' initializer=#108
 108 | Numeral whole='1' decimal='' fract=''
 109 | Return expression='c'
 110 | Composition id='bar' compBody=[]
 111 | Corollary type='ToBeOrNotToBe' id='foo' params=[#112] body=[#113,#115]
 112 | Param type=null varname='b'
 113 | VariableInitialization type='Numeral' name='c' initializer=#114
 114 | Numeral whole='1' decimal='' fract=''
 115 | Return expression='c'
 116 | Array 0=#117
 117 | ForLoop _for='in regards to' s1=#118 s2=#120 s3=[#123] body=[] brk=undefined
 118 | VariableInitialization type='Numeral' name='d' initializer=#119
 119 | Numeral whole='0' decimal='' fract=''
 120 | BinaryExpression left=#121 op='nobler' right=#122
 121 | IdentifierExpression name='d'
 122 | Numeral whole='20' decimal='' fract=''
 123 | IncDec name='d' op='decrement'`

const goodPrograms = {

  // Empty Program:
  "Recognizes empty program" : "",

  // Printing:
  "Recognizes a simple print statement" : "speaketh(\"hello\")",
  "Recognizes arithmetic print statement" : "speaketh(6 with 7)",

  // Variable Declaration:
  "Recognizes declaration of Integer numerals" : "alloweth Numeral x be 6",
  "Recognizes declaration of floating point numerals" : "alloweth Numeral x be 6.3373685",
  "Recognizes declaration of strings" : "alloweth Lexicographical x be \"word\"",
  "Recognizes declaration of null value" : "alloweth IllUsed x be null",
  "Recognizes declaration of boolean truth" : "alloweth ToBeOrNotToBe x be faithful",
  "Recognizes declaration of boolean false" : "alloweth ToBeOrNotToBe x be fallacious",
  "Recognizes declaration of Nonetype" : "alloweth Indistinguishable x be indistinguishable",
  "Recognizes declaration of Liste" : "alloweth Liste x be [3, 5, 7, 9]",
  "Recognizes declaration of Concordance" : "alloweth Concordance x be {12 : 6, 3 : 4, 8 : 9}",
  // Arithmetic:
  "Recognizes a print statement" : "speaketh(x accumulate 5)",
  "Recognizes arithmetic +-" : "x be x with 5 without 6",
  "Recognizes arithmetic */" : "y be x accumulate 6 sunder 12",
  "Recognizes decrementation" : "x decrement",
  "Recognizes specified decrementation" : "x decrementby 4",
  "Recognizes incrememntation" : "x increment",
  "Recognizes specified incrememntation" : "x incrementby 4",

  // Functions:
  "Recognizes basic functions" : "enter ToBeOrNotToBe foo(Numeral x) { \
        alloweth Numeral x be 1 \
        returneth x \
        }",
  "Recognizes nested functions" : "enter ToBeOrNotToBe foo(Numeral x) { \
      alloweth Numeral x be 1 \
        enter ToBeOrNotToBe bar() { \
          speaketh(\"hello\") \
        } \
      returneth x \
      }",
  // Classes:
  "Recognizes empty class" : "Composition foo {}",
  "Recognizes classes" : "Composition foo { \
    enter ToBeOrNotToBe foo(Numeral x) { \
    alloweth Numeral x be 1 \
    returneth x \
    } \
  }",
  "Recognizes nested classes" : "Composition foo { \
    Composition bar { \
    } \
    }",
  "Recognizes nested classes in complex configuration" : "Composition foo { \
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
  "Recognizes basic for loop" : "in regards to (alloweth Numeral x be 0, x nobler 20, x decrement) { \
      speaketh(x) \
    }",
  "Recognizes nested for loop" : "in regards to (alloweth Numeral x be 0, x nobler 20, x decrement) { \
      in regards to (alloweth Numeral y be 0, y nobler 20, y decrement) { \
        speaketh(\"nested\") \
      } \
    }",
    "Recognizes for-in loops" : "in regards to(x within y) { x be foo }",
    "Recognizes nested for-in loops" : "in regards to(x within y) { \
        in regards to (y within z) { \
          y be bar \
        } \
      x be foo }",

  // While Loops:
  "Recognizes basic while loop" : "whilst (x nobler 20) { \
      speaketh(x) \
    }",
  "Recognizes nested while loop" : "whilst (x nobler 20) { \
      whilst (y nobler 20) { \
        speaketh(\"nested\") \
      } \
    }",

  // Do-While Loops:
  "Recognizes basic while loop" : "execute { \
      speaketh(x) \
    } whilst(x nobler y)",
  "Recognizes nested while loop" : "execute { \
      execute { \
        speaketh(x) \
      } whilst(y nobler z) \
    } whilst(x nobler y)",

  // IF-statements:
  "Recognizes if statement" : "whether (x nobler y) { speaketh(x) }",
  "Recognizes if-else statement" : "whether (x nobler y) { speaketh(x) } otherwise { speaketh(y) }",
  "Recognizes if-elif-else statement" : "whether (x nobler y) { speaketh(x) } \
     subsequently(y nobler x) { speaketh(z) } \
     otherwise { speaketh(y) }",

  // Switch-Case Statements:
  "Recognizes Switch-case statement" : "trigger x { condition 0: speaketh(z) condition 1: speaketh(y) }",
  "Recognizes Switch-case with break" : "trigger x { condition 0: speaketh(z) exit condition 1: speaketh(y) exit }",

}

const badPrograms = [
  // Printing:
  ["Disallows printing logical statements", "sayeth(6 with 7 alternatively 6 with 8)", /Line 1, col 7:/],
  ["Disallows saying type names", "sayeth(Numeral)", /Line 1, col 7:/],
  // Variable Assignment:
  ["Disallows incomplete statement", "alloweth", /Line 1, col 9:/],
  ["Disallows declaration", "alloweth x", /Line 1, col 10:/],
  ["Disallows assignment to keyword", "alloweth x be increment", /Line 1, col 10:/],
  ["Disallows assignment to decrementation", "x be x decrement", /Line 1, col 8:/],
  // Arithmetic:

  // Functions:
  ["Disallows non-type function", "enter increment foo(Numeral increment) { returneth 0 }", /Line 1, col 7:/],
  ["Disallows delcaration of function with no type", "enter foo() { returneth 0}", /Line 1, col 7:/],
  ["Disallows creation of empty function", "enter increment foo(Numeral increment) {}", /Line 1, col 7:/],

  // Classes:
  ["Disallows mismatched exits between classes", "Composition foo { Composition bar } { speaketh(\"bar\") }", /Line 1, col 35:/],

  // For loops:
  ["Disallows inadequate statements in for-loop", "in regards to( Numeral x be 0) { speaketh(x) }",/Line 1, col 24:/],
  ["Disallows improper for-in loop", "in regards to( alloweth x be 12) {  speaketh(x) }",/Line 1, col 25:/],

  // While Loops:
  ["Disallows improper while loop", "whilst( Numeral x be 0) { speaketh(x) }",/Line 1, col 19:/],

  // Do-While Loops:
  ["Disallows do loop without while", "execute{alloweth x be 12}",/Line 1, col 18:/],

  // IF-statements:
  ["Disallows if-else-then", "whether (x) { speaketh(x) } otherwise { speaketh(y) } subsequently(y) {speaketh(x) }",/Line 1, col 55:/],

  // Switch-Case Statements:
  ["Disallows switch with no cases", "trigger x { }",/Line 1, col 13:/],
  // Types:
  ["Disallows incomplete statement", "alloweth increment be", /Line 1, col 10:/]
]

describe("the Parser", () => {
  
  // Accepted
  for (const [prompt, code] of Object.entries(goodPrograms)) {
    console.log(prompt)
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
  console.log(util.format(parse(source)))
})