import assert from "assert"
import parse from "../src/parser.js"

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
  "Recognizes assignment to decrementation" : "x be x decrement",

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

const badPrograms = {
  // Printing:
  "Disallows printing logical statements" : "sayeth(6 with 7 alternatively 6 with 8)",
  "Disallows saying type names" : "sayeth(Numeral)",
  // Variable Assignment:
  "Disallows incomplete statement" : "alloweth",
  "Disallows declaration" : "alloweth x",
  "Disallows assignment to keyword" : "alloweth x be increment",
  // Arithmetic:

  // Functions:
  "Disallows non-type function" : "enter increment foo(Numeral increment) { returneth 0 }",
  "Disallows delcaration of function with no type" : "enter foo() { returneth 0}",
  "Disallows creation of empty function" : "enter increment foo(Numeral increment) {}",

  // Classes:
  "Disallows creation of keyword classname" : "Composition Numeral {}",
  "Disallows mismatched exits between classes" : "Composition foo { Composition bar } { speaketh(\"bar\") }",

  // For loops:
  "Disallows inadequate statements in for-loop" : "in regards to( Numeral x be 0) { speaketh(x) }",
  "Disallows improper for-in loop" : "in regards to( alloweth x be 12) {  speaketh(x) }",

  // While Loops:
  "Disallows improper while loop" : "whilst( Numeral x be 0) { speaketh(x) }",

  // Do-While Loops:
  "Disallows do loop without while" : "execute{alloweth x be 12}",

  // IF-statements:
  "Disallows if-else-then" : "whether (x) { speaketh(x) } otherwise { speaketh(y) } subsequently(y) {speaketh(x) }",

  // Switch-Case Statements:
  "Disallows switch with no cases" : "trigger x { }",
  // Types:
  "Disallows incomplete statement" : "alloweth increment be",
}

describe("the Parser", () => {
  
  // Accepted
  for (const [prompt, code] of Object.entries(goodPrograms)) {
    console.log(prompt + "aaa")
      it(prompt, () => {
        assert.ok(parse(code))
      })
  }

  // Recejcted
  for (const [prompt, code] of Object.entries(badPrograms)) {
      it(prompt, () => {
        assert.rejects(parse(code))
      })
  }
})