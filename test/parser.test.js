import assert from "assert"
import parse from "../src/parser.js"
import util from "util"

const source =
 `speaketh("hello")
  speaketh(6 with 7)
  alloweth Numeral x be 6
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

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#8,#10,#12,#19,#31,#35,#41,#47,#48,#50,#57,#99,#106,#118]
   2 | Print expression=#3
   3 | StringValue value='hello'
   4 | Print expression=#5
   5 | BinaryExpression left=#6 op='with' right=#7
   6 | Numeral whole='6' fract=''
   7 | Numeral whole='7' fract=''
   8 | VariableInitialization type='Numeral' name='x' initializer=#9
   9 | Numeral whole='6' fract=''
  10 | VariableInitialization type='Numeral' name='y' initializer=#11
  11 | Numeral whole='6' fract='.33'
  12 | VariableInitialization type='Liste of Numeral' name='z' initializer=#13
  13 | Liste values=#14
  14 | NonEmptyList firstItem=#15 RemainingItems=[#16,#17,#18]
  15 | Numeral whole='3' fract=''
  16 | Numeral whole='5' fract=''
  17 | Numeral whole='7' fract=''
  18 | Numeral whole='9' fract=''
  19 | VariableInitialization type='Concordance of Numeral and Numeral' name='a' initializer=#20
  20 | Concordance dictEntries=#21
  21 | NonEmptyList firstItem=#22 RemainingItems=[#25,#28]
  22 | DictItem key=#23 val=#24
  23 | Numeral whole='12' fract=''
  24 | Numeral whole='6' fract=''
  25 | DictItem key=#26 val=#27
  26 | Numeral whole='3' fract=''
  27 | Numeral whole='4' fract=''
  28 | DictItem key=#29 val=#30
  29 | Numeral whole='8' fract=''
  30 | Numeral whole='9' fract=''
  31 | Print expression=#32
  32 | BinaryExpression left=#33 op='accumulate' right=#34
  33 | IdentifierExpression name='x'
  34 | Numeral whole='5' fract=''
  35 | VariableAssignment name='x' value=#36
  36 | BinaryExpression left=#37 op='without' right=#40
  37 | BinaryExpression left=#38 op='with' right=#39
  38 | IdentifierExpression name='x'
  39 | Numeral whole='5' fract=''
  40 | Numeral whole='6' fract=''
  41 | VariableAssignment name='x' value=#42
  42 | BinaryExpression left=#43 op='sunder' right=#46
  43 | BinaryExpression left=#44 op='accumulate' right=#45
  44 | IdentifierExpression name='x'
  45 | Numeral whole='6' fract=''
  46 | Numeral whole='12' fract=''
  47 | IncDec name='x' op='increment'
  48 | IncDecby name='x' op='incrementby' expression=#49
  49 | Numeral whole='4' fract=''
  50 | Corollary type='ToBeOrNotToBe' id='foo' params=[#51] body=[#52,#56]
  51 | Param type=null varname='f'
  52 | Array 0=#53
  53 | ForIn _for='in regards to' var1=#54 _in=#55 var2=[] body=undefined brk=undefined
  54 | IdentifierExpression name='f'
  55 | IdentifierExpression name='z'
  56 | Return expression='f'
  57 | Array 0=#58 1=#62 2=#73 3=#89
  58 | WhileLoop whle='whilst' logicExp=[#59] body=[] brk=undefined
  59 | BinaryExpression left=#60 op='nobler' right=#61
  60 | IdentifierExpression name='x'
  61 | Numeral whole='20' fract=''
  62 | DoWhile doo='execute' body=[#63] brk='' whle='whilst' logExp=[#70]
  63 | Array 0=#64
  64 | DoWhile doo='execute' body=[#65] brk='' whle='whilst' logExp=[#67]
  65 | Print expression=#66
  66 | IdentifierExpression name='x'
  67 | BinaryExpression left=#68 op='nobler' right=#69
  68 | IdentifierExpression name='x'
  69 | IdentifierExpression name='x'
  70 | BinaryExpression left=#71 op='nobler' right=#72
  71 | IdentifierExpression name='x'
  72 | IdentifierExpression name='x'
  73 | IfStatement _if='whether' le1=[#74] body=[#77] _elif='subsequently( x nobler x ) {\n    speaketh(x)\n  }' le2=[#79] body2=[#83] _else='otherwise {\n    speaketh(x)\n  }' body3=[#86]
  74 | BinaryExpression left=#75 op='nobler' right=#76
  75 | IdentifierExpression name='x'
  76 | IdentifierExpression name='x'
  77 | Print expression=#78
  78 | IdentifierExpression name='x'
  79 | Array 0=#80
  80 | BinaryExpression left=#81 op='nobler' right=#82
  81 | IdentifierExpression name='x'
  82 | IdentifierExpression name='x'
  83 | Array 0=#84
  84 | Print expression=#85
  85 | IdentifierExpression name='x'
  86 | Array 0=#87
  87 | Print expression=#88
  88 | IdentifierExpression name='x'
  89 | SwitchStatement swtch='trigger' factor1=#90 cse='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit' factor2=[#91,#92] body=[#93,#96] brk='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit'
  90 | IdentifierExpression name='x'
  91 | Numeral whole='0' fract=''
  92 | Numeral whole='1' fract=''
  93 | Array 0=#94
  94 | Print expression=#95
  95 | IdentifierExpression name='x'
  96 | Array 0=#97
  97 | Print expression=#98
  98 | IdentifierExpression name='x'
  99 | Corollary type='ToBeOrNotToBe' id='foo' params=[#100] body=[#101,#103]
 100 | Param type=null varname='b'
 101 | VariableInitialization type='Numeral' name='c' initializer=#102
 102 | Numeral whole='1' fract=''
 103 | Corollary type='ToBeOrNotToBe' id='bar' params=[] body=[#104]
 104 | Print expression=#105
 105 | StringValue value='hello'
 106 | Composition id='foo' compBody=[#107,#112,#113]
 107 | Corollary type='ToBeOrNotToBe' id='foo' params=[#108] body=[#109,#111]
 108 | Param type=null varname='b'
 109 | VariableInitialization type='Numeral' name='c' initializer=#110
 110 | Numeral whole='1' fract=''
 111 | Return expression='c'
 112 | Composition id='bar' compBody=[]
 113 | Corollary type='ToBeOrNotToBe' id='foo' params=[#114] body=[#115,#117]
 114 | Param type=null varname='b'
 115 | VariableInitialization type='Numeral' name='c' initializer=#116
 116 | Numeral whole='1' fract=''
 117 | Return expression='c'
 118 | Array 0=#119
 119 | ForLoop _for='in regards to' s1=#120 s2=#122 s3=[#125] body=[] brk=undefined
 120 | VariableInitialization type='Numeral' name='d' initializer=#121
 121 | Numeral whole='0' fract=''
 122 | BinaryExpression left=#123 op='nobler' right=#124
 123 | IdentifierExpression name='d'
 124 | Numeral whole='20' fract=''
 125 | IncDec name='d' op='decrement'`

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
  "Recognizes declaration of null value" : "alloweth Illused x be null",
  "Recognizes declaration of boolean truth" : "alloweth ToBeOrNotToBe x be faithful",
  "Recognizes declaration of boolean false" : "alloweth ToBeOrNotToBe x be fallacious",
  "Recognizes declaration of Nonetype" : "alloweth Indistinguishable x be indistinguishable",
  "Recognizes declaration of Liste" : "alloweth Liste of Numeral x be [3, 5, 7, 9]",
  "Recognizes declaration of Concordance" : "alloweth Concordance of Numeral and Numeral x be {12 : 6, 3 : 4, 8 : 9}",
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
  "Recognizes creation of empty function" : "enter Numeral foo(Numeral x) {}",
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
  ["Disallows non-type function", "enter toal foo(Numeral increment) { returneth 0 }", /Line 1, col 7:/],
  ["Disallows delcaration of function with no type", "enter foo() { returneth 0}", /Line 1, col 7:/],

  // Classes:
  ["Disallows mismatched exits between classes", "Composition foo { Composition bar } { speaketh(\"bar\") }", /Line 1, col 35:/],

  // For loops:
  ["Disallows inadequate statements in for-loop", "in regards to( Numeral x be 0) { speaketh(x) }",/Line 1, col 16:/],
  ["Disallows improper for-in loop", "in regards to( alloweth x be 12) {  speaketh(x) }",/Line 1, col 25:/],

  // While Loops:
  ["Disallows improper while loop", "whilst( Numeral x be 0) { speaketh(x) }",/Line 1, col 9:/],

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