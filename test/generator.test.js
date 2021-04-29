import assert from "assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
// import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "unary",
    source: `alloweth ToBeOrNotToBe sally be nay(fallacious)`,
    expected: dedent`let sally = !(false)`,
  },
  {
    name: "Numeral dec and assignment",
    source: `
    alloweth Numeral x be 3
    x be 4
    speaketh(x)
    `,
    expected: dedent`
    let x = 3
    x = 4
    console.log(x)
    `
  },
  {
    name: "Square-root test",
    source: `
    alloweth Numeral a be quadrangle(4)
    speaketh(a tis 2)
    `,
    expected: dedent`
    let a = Math.sqrt(4)
    console.log((a === 2))
    `
  },
  {
    name: "small",
    source: `
      alloweth Numeral x be 3 accumulate 7
      x increment
      x decrement
      alloweth ToBeOrNotToBe y be fallacious
      y be ((5 exponentiate -x) sunder -100 nobler -x alternatively fallacious)
      speaketh(y furthermore y alternatively fallacious alternatively x accumulate 2 tis not 5)
    `,
    expected: dedent`
      let x = (3 * 7)
      x++
      x--
      let y = false
      y = ((((5 ** -x) / -100) > -x) || false)
      console.log((y && (y || (false || ((x * 2) !== 5)))))
    `,
  },
  {
    name: "if",
    source: `
      alloweth Numeral x be 0
      whether (x tis 0) { speaketh("1") }
      whether (x tis 0) { speaketh(1) } otherwise { speaketh(2) }
      whether (x tis 0) { speaketh(1) } subsequently (x tis 2) { speaketh(3) }
      whether (x tis 0) { speaketh(1) } subsequently (x tis 2) { speaketh(3) } otherwise { speaketh(4) }
    `,
    expected: dedent`
      let x = 0
      if ((x === 0)) {
        console.log("1")
      }
      if ((x === 0)) {
        console.log(1)
      } else {
        console.log(2)
      }
      if ((x === 0)) {
        console.log(1)
      } else if ((x === 2)) {
        console.log(3)
      }
      if ((x === 0)) {
        console.log(1)
      } else if ((x === 2)) {
        console.log(3)
      } else {
        console.log(4)
      }
    `,
  },
  {
    name: "while",
    source: `
      alloweth Numeral x be 0
      whilst (x lesser 5) {
        alloweth Numeral y be 0
        whilst (y lesser 5) {
          speaketh(x accumulate y)
          y be y with 1
          exit
        }
        x be x with 1
      }
    `,
    expected: dedent`
      let x = 0
      while ((x < 5)) {
        let y = 0
        while ((y < 5)) {
          console.log((x * y))
          y = (y + 1)
          break
        }
        x = (x + 1)
      }
    `,
  },
  {
    name: "functions",
    source: `
      alloweth Numeral z be 0.5
      enter ToBeOrNotToBe f(Numeral x, ToBeOrNotToBe y) {
        speaketh((x nobler absolutization(x)))
        returneth faithful
      }
      enter ToBeOrNotToBe g() {
        returneth fallacious
      }
    `,
    expected: dedent`
      let z = 0.5
      function f(x, y) {
        console.log((x > Math.abs(x)))
        return true
      }
      function g() {
        return false
      }
    `,
  },
  {
    name: "function calls",
    source: `
      enter ToBeOrNotToBe f(Numeral x, ToBeOrNotToBe y) {
        speaketh((x nobler absolutization(x)))
        returneth faithful
      }
      enter ToBeOrNotToBe g() {
        returneth fallacious
      }
      f(0.5, g())
      g()
    `,
    expected: dedent`
      function f(x, y) {
        console.log((x > Math.abs(x)))
        return true
      }
      function g() {
        return false
      }
      f(0.5, g())
      g()
    `,
  },
  {
    name: "arrays",
    source: `
      alloweth Liste of ToBeOrNotToBe a be [faithful, fallacious, faithful]
      alloweth Liste of Numeral b be [10, (40 without 20), 30]
      speaketh(a[0] alternatively (b[0] lesser b[3]))
    `,
    expected: dedent`
      let a = [true, false, true]
      let b = [10, (40 - 20), 30]
      console.log((a[0] || (b[0] < b[3])))
    `,
  },
  {
    name: "dictionaries",
    source: `
      alloweth Concordance of Lexicographical and Numeral S be { "x" : 5 }
      alloweth Numeral y be S."x"
      speaketh(y)
    `,
    expected: dedent`
      let S = {"x" : 5}
      let y = S["x"]
      console.log(y)
    `,
  },
  {
    name: "for loops",
    source: `
      alloweth Liste of Numeral a be [10, 20, 30]
      in regards to (alloweth Numeral i be 0, i lesser 50, i increment ) {
        speaketh(i)
      }
      in regards to(alloweth Numeral j be 0, j lesser 3, j increment ) {
        speaketh(a[j])
      }
    `,
    expected: dedent`
      let a = [10, 20, 30]
      for (let i = 0; (i < 50); i++) {
        console.log(i)
      }
      for (let j = 0; (j < 3); j++) {
        console.log(a[j])
      }
    `,
  },
  {
    name: "statements",
    source: `
      alloweth Numeral x be 0
      x be 10
      speaketh(x)
      x incrementby 4
      x decrement
      alloweth ToBeOrNotToBe y be fallacious
      y be nay(y)
      alloweth Numeral z be 10
      y be z lesser x
      y be z nobler x
      z be z with x
      x be z without x
      x be z accumulate z
      x be z sunder z
      x be z residue 5
      z be z exponentiate 3
    `,
    expected: dedent`
      let x = 0
      x = 10
      console.log(x)
      x += 4
      x--
      let y = false
      y = !(y)
      let z = 10
      y = (z < x)
      y = (z > x)
      z = (z + x)
      x = (z - x)
      x = (z * z)
      x = (z / z)
      x = (z % 5)
      z = (z ** 3)
    `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(analyze(parse(fixture.source)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})