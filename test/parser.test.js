import assert from "assert"
import parse from "../src/parser.js"

const goodPrograms = {
  "Recognizes a simple print statement" : "alloweth myVar be \"hello\"",
  "Recognizes a print statement" : "speaketh(x accumulate 5)",
  "Recognizes arithmetic +-" : "x with 5 without 6",
  "Recognizes arithmetic */" : "x accumulate 6 sunder 12",
  "Recognizes functions" : "enter ToBeOrNotToBe foo(Numeral x) { \
        alloweth x be 1 \
        return x \
        }",
  "Recognizes decrementation" : "x decrement",
  "Recognizes specified decrementation" : "x decrementby 4",
  "Recognizes incrememntation" : "x increment",
  "Recognizes specified incrememntation" : "x incrementby 4",
  "Recognizes assignment to decrementation" : "x be x decrement"
}

const badPrograms = {
  "Disallows empty program" : "",
  "Disallows incomplete statement" : "alloweth",
  "Disallows incomplete statement" : "alloweth increment be",
  "Disallows declaration" : "allow x",
  "Disallows assignment to keyword" : "allow x be increment",
  "Disallows non-type function" : "enter increment foo(Numeral increment) {}"
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
        assert.ok(parse(code))
      })
  }
})