import assert from "assert"
import parse from "../src/parse.js"

const goodPrograms = [
  "alloweth myVar be \"hello\"",
  "speaketh(x accumulate 5)",
  "x with 5 without 6",
  "x accumulate 6 sunder 12",
  "enter ToBeOrNotToBe foo(Numeral x) { \
  alloweth x be 1 \
  return x \
  }",
  "x decrement",
  "x decrementby 4",
  "x increment",
  "x incrementby 4",
  "x be x decrement"
]

const badPrograms = [
  "",
  "alloweth",
  "alloweth increment be",
  "allow x",
  "allow x be increment",
  "enter increment foo(Numeral increment) {}"
]