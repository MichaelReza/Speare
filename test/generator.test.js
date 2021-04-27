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
    name: "small",
    source: `
      alloweth Numeral x be 3 accumulate 7
      x increment
      x decrement
      alloweth ToBeOrNotToBe y be fallacious
      y be (((5 exponentiate -x) sunder -100 tis nobler -x) alternatively fallacious)
      speaketh((y furthermore y) alternatively fallacious alternatively (x accumulate 2) tis not 5)
    `,
    expected: dedent`
      let x = 3 * 7
      x++
      x--
      let y = false
      y = (((5 ** -x) / -100) > -x) || false
      console.log((y && y) || false || (x * 2) !== 5)
    `,
  },
  // {
  //   name: "if",
  //   source: `
  //     alloweth numeral x be 0
  //     whether (x tis 0) { speaketh("1") }
  //     whether (x tis 0) { speaketh(1) } otherwise { speaketh(2) }
  //     whether (x tis 0) { speaketh(1) } subsequently (x tis 2) { speaketh(3) }
  //     whether (x tis 0) { speaketh(1) } subsequently (x tis 2) { speaketh(3) } otherwise { speaketh(4) }
  //   `,
  //   expected: dedent`
  //     let x_2 = 0;
  //     if ((x_2 === 0)) {
  //       console.log("1");
  //     }
  //     if ((x_2 === 0)) {
  //       console.log(1);
  //     } else {
  //       console.log(2);
  //     }
  //     if ((x_2 === 0)) {
  //       console.log(1);
  //     } else {
  //       if ((x_2 === 2)) {
  //         console.log(3);
  //       }
  //     }
  //     if ((x_2 === 0)) {
  //       console.log(1);
  //     } else
  //       if ((x_2 === 2)) {
  //         console.log(3);
  //       } else {
  //         console.log(4);
  //       }
  //   `,
  // },
  // {
  //   name: "while",
  //   source: `
  //     alloweth Numeral x be 0
  //     whilst (x lesser 5) {
  //       alloweth Numeral y be 0
  //       whilst (y lesser 5) {
  //         speaketh(x accumulate y)
  //         y be y with 1
  //         exit
  //       }
  //       x be x with 1
  //     }
  //     execute {
  //       speaketh(x)
  //       x be x with 1
  //     } whilst (x lesser 10)
  //   `,
  //   expected: dedent`
  //     let x_3 = 0;
  //     while ((x_3 < 5)) {
  //       let y_2 = 0;
  //       while ((y_2 < 5)) {
  //         console.log((x_3 * y_2));
  //         y_2 = (y_2 + 1);
  //         break;
  //       }
  //       x_3 = (x_3 + 1);
  //     }
  //     do {
  //       console.log(x_3);
  //       x_3 = (x_3 + 1);
  //     } while((x_3 < 10));
  //   `,
  // },
  // {
  //   name: "functions",
  //   source: `
  //     alloweth Numeral z be 0.5

  //     enter ToBeOrNotToBe f(Numeral x, ToBeOrNotToBe y) {
  //       speaketh(x nobler absolutization(x))
  //       returneth faithful
  //     }
  //     enter ToBeOrNotToBe g() {
  //       returneth fallacious
  //     }

  //     f(z, g())
  //   `,
  //   expected: dedent`
  //     let z_1 = 0.5;
  //     function f_2(x_3, y_4) {
  //       console.log((Math.sin(x_3) > Math.PI));
  //       return;
  //     }
  //     function g_5() {
  //       return false;
  //     }
  //     f_2(z_1, g_5());
  //   `,
  // },
  // {
  //   name: "arrays",
  //   source: `
  //     alloweth Liste of ToBeOrNotToBe a be [faithful, fallacious, faithful]
  //     alloweth Liste of Numeral b be [10, 40 - 20, 30]
  //     speaketh(a[0] alternatively (b[0] lesser 88))
  //   `,
  //   expected: dedent`
  //     let a_1 = [true, false, true];
  //     let b_2 = [10, 20, 30];
  //     console.log((a_1[1] || (((b_2[0] < 88)) ? (false) : (true))));
  //   `,
  // },
  // {
  //   name: "dictionaries",
  //   source: `
  //     alloweth Numeral x be 12
  //     Concordance of Numeral and Numeral S be { x : 5 }
  //     alloweth Numeral y be S.x
  //     speaketh(y)
  //   `,
  //   expected: dedent`
  //     let x_3 = 5;
  //     let S = {
  //       x : 5
  //     }
  //     let y_3 = S.x;
  //     console.log(y_3);
  //   `,
  // },
  // {
  //   name: "for loops",
  //   source: `
  //     alloweth Liste of Numeral a be [10, 20, 30]
  //     in regards to (Numeral i be 0, i lesser 50, i increment ) {
  //       speaketh(i)
  //     }
  //     in regards to(Numeral j be 0, j lesser 3, j increment ) {
  //       speaketh(a[j])
  //     }
  //   `,
  //   expected: dedent`
  //     let a_0 = [10, 20, 30];
  //     for (let i_1 = 0; i_1 < 50; i_1++) {
  //       console.log(i_1);
  //     }
  //     for (let j_2 = 0; j_2 < 3; j_2++) {
  //       console.log(a_0[j_2]);
  //     }
  //   `,
  // },
  // {
  //   name: "switch",
  //   source: `
  //     alloweth Numeral x be 0
  //     trigger x {
  //       condition 0:
  //         speaketh(x)
  //         exit
  //       condition 1:
  //         speaketh(x sunder 2)
  //         exit
  //     }
  //   `,
  //   expected: dedent`
  //     let x_11 = 0;
  //     switch(x_11) {
  //       case 0:
  //         console.log(x_11);
  //         break;
  //       case 1:
  //         console.log(x_11 - 2);
  //         break;
  //     }
  //   `,
  // },
  // {
  //   name: "class",
  //   source: `
  //     Composition Foo {
  //       alloweth Numeral _x be 10
  //       enter Composition constructor(Numeral x) {
  //         _x be x
  //       }

  //       enter Numeral getX() {
  //         returneth _x
  //       }
  //     }
  //   `,
  //   expected: dedent`
  //     class Foo {
  //       let _x = 10

  //       constructor(x) {
  //         _x = x
  //       }

  //       function getX() {
  //         return _x
  //       }
  //     }
  //   `,
  // },
  // {
  //   name: "statements",
  //   source: `
  //     alloweth Numeral x be 0
  //     x be 10
  //     speaketh(x)
  //     x incrementby 4
  //     x decrement
  //     alloweth ToBeOrNotToBe y be fallacious
  //     y be nay(y)
  //     alloweth Numeral z be 10
  //     y be z lesser x
  //     y be z nobler x
  //     z be z with x
  //     x be z without x
  //     x be z accumulate z
  //     x be z sunder z
  //     x be z residue 5
  //     z be z exponentiate 3
  //   `,
  //   expected: dedent`
  //     let x_10 = 0;
  //     x_10 = 10;
  //     console.log(x_10);
  //     x_10 = (x_10 + 4);
  //     x_10 = (x_10 - 1);
  //     let y_10 = false;
  //     y_10 = !y_10;
  //     let z_10 = 10;
  //     y = z_10 < x_10;
  //     y = z_10 > x_10;
  //     z_10 = z_10 + Z_10;
  //     x_10 = z_10 - z_10;
  //     x_10 = z_10 % 5;
  //     z_10 = z_10 ** 3;
  //   `,
  // },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(analyze(parse(fixture.source)))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
