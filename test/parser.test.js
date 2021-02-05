import assert from "assert"
import parse from "../src/parser.js"

const goodPrograms = {

  // Empty Program:
  "Recognizes empty program" : "",

  // Printing:
  "Recognizes a simple print statement" : "alloweth myVar be \"hello\"",

  // Variable Declaration:

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
  "Recognizes functions" : "enter ToBeOrNotToBe foo(Numeral x) { \
        alloweth x be 1 \
        returneth x \
        }",
  // Classes:

  // For loops:

  // While Loops:

  // Do-While Loops:

  // IF-statements:

  // Switch-Case Statements:

}

const badPrograms = {
  "Disallows declaration" : "alloweth x",
  "Disallows assignment to keyword" : "alloweth x be increment",
  "Disallows non-type function" : "enter increment foo(Numeral increment) {}",
  // Printing:

  // Variable Declaration:
 "Disallows incomplete statement" : "alloweth",
  // Arithmetic:

  // Functions:

  // Classes:

  // For loops:

  // While Loops:

  // Do-While Loops:

  // IF-statements:

  // Switch-Case Statements:

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