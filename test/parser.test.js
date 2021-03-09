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
  subsequently(x nobler x) {
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

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#8,#10,#12,#19,#23,#27,#33,#39,#40,#42,#49,#82,#89,#101]
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
  13 | ArrayType type=[#14] values=[#15]
  14 | Numeral whole='3' decimal='' fract=''
  15 | Array 0=#16 1=#17 2=#18
  16 | Numeral whole='5' decimal='' fract=''
  17 | Numeral whole='7' decimal='' fract=''
  18 | Numeral whole='9' decimal='' fract=''
  19 | VariableInitialization type='Concordance' name='a' initializer=#20
  20 | DictType keyType=[#21] valType=[#22]
  21 | Numeral whole='12' decimal='' fract=''
  22 | Numeral whole='6' decimal='' fract=''
  23 | Print expression=#24
  24 | BinaryExpression left=#25 op='accumulate' right=#26
  25 | IdentifierExpression name='x'
  26 | Numeral whole='5' decimal='' fract=''
  27 | VariableAssignment name='x' value=#28
  28 | BinaryExpression left=#29 op='without' right=#32
  29 | BinaryExpression left=#30 op='with' right=#31
  30 | IdentifierExpression name='x'
  31 | Numeral whole='5' decimal='' fract=''
  32 | Numeral whole='6' decimal='' fract=''
  33 | VariableAssignment name='x' value=#34
  34 | BinaryExpression left=#35 op='sunder' right=#38
  35 | BinaryExpression left=#36 op='accumulate' right=#37
  36 | IdentifierExpression name='x'
  37 | Numeral whole='6' decimal='' fract=''
  38 | Numeral whole='12' decimal='' fract=''
  39 | IncDec name='x' op='increment'
  40 | IncDecby name='x' op='incrementby' expression=#41
  41 | Numeral whole='4' decimal='' fract=''
  42 | Corollary type='foo' id='ToBeOrNotToBe' params=[#43] body=[#44,#48]
  43 | Param type=null varname='f'
  44 | Array 0=#45
  45 | ForIn _for='in regards to' var1=#46 _in=#47 var2=[] body=undefined brk=undefined
  46 | IdentifierExpression name='f'
  47 | IdentifierExpression name='z'
  48 | Return expression='f'
  49 | Array 0=#50 1=#54 2=#65 3=#81
  50 | WhileLoop whle='whilst' logicExp=[#51] body=[] brk=undefined
  51 | BinaryExpression left=#52 op='nobler' right=#53
  52 | IdentifierExpression name='x'
  53 | Numeral whole='20' decimal='' fract=''
  54 | DoWhile doo='execute' body=[#55] brk='' whle='whilst' logExp=[#62]
  55 | Array 0=#56
  56 | DoWhile doo='execute' body=[#57] brk='' whle='whilst' logExp=[#59]
  57 | Print expression=#58
  58 | IdentifierExpression name='x'
  59 | BinaryExpression left=#60 op='nobler' right=#61
  60 | IdentifierExpression name='x'
  61 | IdentifierExpression name='x'
  62 | BinaryExpression left=#63 op='nobler' right=#64
  63 | IdentifierExpression name='x'
  64 | IdentifierExpression name='x'
  65 | IfStatement _if='whether' exp1=[#66] bd1=[#69] _elif='subsequently(x nobler x) {\n    speaketh(x)\n  }' exp2=[#71] bd2=[#75] _else='otherwise {\n    speaketh(x)\n  }' exp3=[#78] bd3=undefined
  66 | BinaryExpression left=#67 op='nobler' right=#68
  67 | IdentifierExpression name='x'
  68 | IdentifierExpression name='x'
  69 | Print expression=#70
  70 | IdentifierExpression name='x'
  71 | Array 0=#72
  72 | BinaryExpression left=#73 op='nobler' right=#74
  73 | IdentifierExpression name='x'
  74 | IdentifierExpression name='x'
  75 | Array 0=#76
  76 | Print expression=#77
  77 | IdentifierExpression name='x'
  78 | Array 0=#79
  79 | Print expression=#80
  80 | IdentifierExpression name='x'
  81 | SwitchStatement
  82 | Corollary type='foo' id='ToBeOrNotToBe' params=[#83] body=[#84,#86]
  83 | Param type=null varname='b'
  84 | VariableInitialization type='Numeral' name='c' initializer=#85
  85 | Numeral whole='1' decimal='' fract=''
  86 | Corollary type='bar' id='ToBeOrNotToBe' params=[] body=[#87]
  87 | Print expression=#88
  88 | StringValue value='hello'
  89 | Composition id='foo' compBody=[#90,#95,#96]
  90 | Corollary type='foo' id='ToBeOrNotToBe' params=[#91] body=[#92,#94]
  91 | Param type=null varname='b'
  92 | VariableInitialization type='Numeral' name='c' initializer=#93
  93 | Numeral whole='1' decimal='' fract=''
  94 | Return expression='c'
  95 | Composition id='bar' compBody=[]
  96 | Corollary type='foo' id='ToBeOrNotToBe' params=[#97] body=[#98,#100]
  97 | Param type=null varname='b'
  98 | VariableInitialization type='Numeral' name='c' initializer=#99
  99 | Numeral whole='1' decimal='' fract=''
 100 | Return expression='c'
 101 | Array 0=#102
 102 | ForLoop _for='in regards to' s1=#103 s2=#105 s3=[#108] body=[] brk=undefined
 103 | VariableInitialization type='Numeral' name='d' initializer=#104
 104 | Numeral whole='0' decimal='' fract=''
 105 | BinaryExpression left=#106 op='nobler' right=#107
 106 | IdentifierExpression name='d'
 107 | Numeral whole='20' decimal='' fract=''
 108 | IncDec name='d' op='decrement'`

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