import assert from "assert"
import parse from "../src/parser.js"
import util from "util"

const source =
 `speaketh("hello")
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

const expectedAst = String.raw`   1 | Program statements=[#2,#4,#10,#13,#20,#24,#28,#34,#37,#48,#66,#71,#79,#87,#88,#91,#98,#143,#151,#165]
   2 | Print expression=#3
   3 | StringValue value='hello'
   4 | Print expression=#5
   5 | BinaryExpression left=#6 op='with' right=#8
   6 | UnaryAssignment value=#7
   7 | Numeral whole='6' fract=''
   8 | UnaryAssignment value=#9
   9 | Numeral whole='7' fract=''
  10 | VariableInitialization type='Numeral' name='x' initializer=#11
  11 | UnaryAssignment value=#12
  12 | Numeral whole='6' fract=''
  13 | VariableInitialization type='Numeral' name='qwerty' initializer=#14
  14 | BinaryExpression left=#15 op=undefined right=undefined
  15 | BinaryExpression left=#16 op='without' right=#18
  16 | UnaryAssignment value=#17
  17 | Numeral whole='47' fract=''
  18 | UnaryAssignment value=#19
  19 | Numeral whole='14' fract=''
  20 | VariableInitialization type='Numeral' name='yuiop' initializer=#21
  21 | UnaryExpression sign='nay' value=#22
  22 | UnaryAssignment value=#23
  23 | Numeral whole='27' fract=''
  24 | Print expression=#25
  25 | BinaryExpression left=#26 op='furthermore' right=#27
  26 | IdentifierExpression name='x'
  27 | IdentifierExpression name='y'
  28 | VariableInitialization type='Numeral' name='x' initializer=#29
  29 | BinaryExpression left=#30 op='exponentiate' right=#32
  30 | UnaryAssignment value=#31
  31 | Numeral whole='6' fract=''
  32 | UnaryAssignment value=#33
  33 | Numeral whole='2' fract=''
  34 | VariableInitialization type='Numeral' name='y' initializer=#35
  35 | UnaryAssignment value=#36
  36 | Numeral whole='6' fract='.33'
  37 | VariableInitialization type='Liste of Numeral' name='z' initializer=#38
  38 | UnaryAssignment value=#39
  39 | Liste values=[#40,#42,#44,#46]
  40 | UnaryAssignment value=#41
  41 | Numeral whole='3' fract=''
  42 | UnaryAssignment value=#43
  43 | Numeral whole='5' fract=''
  44 | UnaryAssignment value=#45
  45 | Numeral whole='7' fract=''
  46 | UnaryAssignment value=#47
  47 | Numeral whole='9' fract=''
  48 | VariableInitialization type='Concordance of Numeral and Numeral' name='a' initializer=#49
  49 | UnaryAssignment value=#50
  50 | Concordance dictEntries=[#51,#56,#61]
  51 | DictItem key=#52 val=#54
  52 | UnaryAssignment value=#53
  53 | Numeral whole='12' fract=''
  54 | UnaryAssignment value=#55
  55 | Numeral whole='6' fract=''
  56 | DictItem key=#57 val=#59
  57 | UnaryAssignment value=#58
  58 | Numeral whole='3' fract=''
  59 | UnaryAssignment value=#60
  60 | Numeral whole='4' fract=''
  61 | DictItem key=#62 val=#64
  62 | UnaryAssignment value=#63
  63 | Numeral whole='8' fract=''
  64 | UnaryAssignment value=#65
  65 | Numeral whole='9' fract=''
  66 | Print expression=#67
  67 | BinaryExpression left=#68 op='accumulate' right=#69
  68 | IdentifierExpression name='x'
  69 | UnaryAssignment value=#70
  70 | Numeral whole='5' fract=''
  71 | VariableAssignment name='x' value=#72
  72 | BinaryExpression left=#73 op='without' right=#77
  73 | BinaryExpression left=#74 op='with' right=#75
  74 | IdentifierExpression name='x'
  75 | UnaryAssignment value=#76
  76 | Numeral whole='5' fract=''
  77 | UnaryAssignment value=#78
  78 | Numeral whole='6' fract=''
  79 | VariableAssignment name='x' value=#80
  80 | BinaryExpression left=#81 op='sunder' right=#85
  81 | BinaryExpression left=#82 op='accumulate' right=#83
  82 | IdentifierExpression name='x'
  83 | UnaryAssignment value=#84
  84 | Numeral whole='6' fract=''
  85 | UnaryAssignment value=#86
  86 | Numeral whole='12' fract=''
  87 | IncDec name='x' op='increment'
  88 | IncDecby name='x' op='incrementby' expression=#89
  89 | UnaryAssignment value=#90
  90 | Numeral whole='4' fract=''
  91 | Corollary type='ToBeOrNotToBe' id='foo' params=[#92] body=[#93,#97]
  92 | Param type=null varname='f'
  93 | Array 0=#94
  94 | ForIn _for='in regards to' var1=#95 _in=#96 var2=[] body=undefined brk=undefined
  95 | IdentifierExpression name='f'
  96 | IdentifierExpression name='z'
  97 | Return expression='f'
  98 | Array 0=#99 1=#104 2=#115 3=#131
  99 | WhileLoop whle='whilst' logicExp=[#100] body=[] brk=undefined
 100 | BinaryExpression left=#101 op='nobler' right=#102
 101 | IdentifierExpression name='x'
 102 | UnaryAssignment value=#103
 103 | Numeral whole='20' fract=''
 104 | DoWhile doo='execute' body=[#105] brk='' whle='whilst' logExp=[#112]
 105 | Array 0=#106
 106 | DoWhile doo='execute' body=[#107] brk='' whle='whilst' logExp=[#109]
 107 | Print expression=#108
 108 | IdentifierExpression name='x'
 109 | BinaryExpression left=#110 op='nobler' right=#111
 110 | IdentifierExpression name='x'
 111 | IdentifierExpression name='x'
 112 | BinaryExpression left=#113 op='nobler' right=#114
 113 | IdentifierExpression name='x'
 114 | IdentifierExpression name='x'
 115 | IfStatement _if='whether' le1=[#116] body=[#119] _elif='subsequently( x nobler x ) {\n    speaketh(x)\n  }' le2=[#121] body2=[#125] _else='otherwise {\n    speaketh(x)\n  }' body3=[#128]
 116 | BinaryExpression left=#117 op='nobler' right=#118
 117 | IdentifierExpression name='x'
 118 | IdentifierExpression name='x'
 119 | Print expression=#120
 120 | IdentifierExpression name='x'
 121 | Array 0=#122
 122 | BinaryExpression left=#123 op='nobler' right=#124
 123 | IdentifierExpression name='x'
 124 | IdentifierExpression name='x'
 125 | Array 0=#126
 126 | Print expression=#127
 127 | IdentifierExpression name='x'
 128 | Array 0=#129
 129 | Print expression=#130
 130 | IdentifierExpression name='x'
 131 | SwitchStatement swtch='trigger' factor1=#132 cse='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit' factor2=[#133,#135] body=[#137,#140] brk='condition 0:\n' +
  '      speaketh(x)\n' +
  '      exit\n' +
  '    condition 1:\n' +
  '      speaketh(x)\n' +
  '      exit'
 132 | IdentifierExpression name='x'
 133 | UnaryAssignment value=#134
 134 | Numeral whole='0' fract=''
 135 | UnaryAssignment value=#136
 136 | Numeral whole='1' fract=''
 137 | Array 0=#138
 138 | Print expression=#139
 139 | IdentifierExpression name='x'
 140 | Array 0=#141
 141 | Print expression=#142
 142 | IdentifierExpression name='x'
 143 | Corollary type='ToBeOrNotToBe' id='foo' params=[#144] body=[#145,#148]
 144 | Param type=null varname='b'
 145 | VariableInitialization type='Numeral' name='c' initializer=#146
 146 | UnaryAssignment value=#147
 147 | Numeral whole='1' fract=''
 148 | Corollary type='ToBeOrNotToBe' id='bar' params=[] body=[#149]
 149 | Print expression=#150
 150 | StringValue value='hello'
 151 | Composition id='foo' compBody=[#152,#158,#159]
 152 | Corollary type='ToBeOrNotToBe' id='foo' params=[#153] body=[#154,#157]
 153 | Param type=null varname='b'
 154 | VariableInitialization type='Numeral' name='c' initializer=#155
 155 | UnaryAssignment value=#156
 156 | Numeral whole='1' fract=''
 157 | Return expression='c'
 158 | Composition id='bar' compBody=[]
 159 | Corollary type='ToBeOrNotToBe' id='foo' params=[#160] body=[#161,#164]
 160 | Param type=null varname='b'
 161 | VariableInitialization type='Numeral' name='c' initializer=#162
 162 | UnaryAssignment value=#163
 163 | Numeral whole='1' fract=''
 164 | Return expression='c'
 165 | Array 0=#166
 166 | ForLoop _for='in regards to' s1=#167 s2=#170 s3=[#174] body=[] brk=undefined
 167 | VariableInitialization type='Numeral' name='d' initializer=#168
 168 | UnaryAssignment value=#169
 169 | Numeral whole='0' fract=''
 170 | BinaryExpression left=#171 op='nobler' right=#172
 171 | IdentifierExpression name='d'
 172 | UnaryAssignment value=#173
 173 | Numeral whole='20' fract=''
 174 | IncDec name='d' op='decrement'`

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
  // console.log(util.format(parse(source)))
})