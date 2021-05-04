import assert from "assert/strict"
import optimize from "../src/optimizer.js"
import * as ast from "../src/ast.js"

const x = new ast.VariableInitialization("Numeral", "x", 0)
const bool = new ast.VariableInitialization("ToBeOrNotToBe", "bool", false)
const xpp = new ast.IncDec(x, "increment")
const xmm = new ast.IncDec(x, "decrement")
const return1p1 = new ast.Return(new ast.BinaryExpression(1, "with", 1))
const return2 = new ast.Return(2)
const returnX = new ast.Return(x)
const onePlusTwo = new ast.BinaryExpression(1, "with", 2)
const body = returnX
const paramEx = new ast.Param("Lexicographical", "stringy")
const identity = Object.assign(new ast.Corollary("ToBeOrNotToBe", "foo", [], body))
const intFun = body => new ast.Corollary("Numeral", "bar", [paramEx], body)
const callIdentity = args => new ast.Call(identity.id, args)
const or = (...d) => d.reduce((x, y) => new ast.BinaryExpression(x,"alternatively", y))
const and = (...c) => c.reduce((x, y) => new ast.BinaryExpression(x, "furthermore", y))
const less = (x, y) => new ast.BinaryExpression(x, "lesser", y)
const eq = (x, y) => new ast.BinaryExpression(x, "tis", y)
const times = (x, y) => new ast.BinaryExpression(x,"accumulate", y)
const neg = x => new ast.UnaryExpression("-", x)
const array = (...elements) => new ast.Liste(elements)
const sub = (a, e) => new ast.ArrayLookup(a, e)

const tests = [
  ["folds +", new ast.BinaryExpression(5, "with", 8), 13],
  ["folds -", new ast.BinaryExpression(5n, "without", 8n), -3n],
  ["folds *", new ast.BinaryExpression(5, "accumulate", 8), 40],
  ["folds %", new ast.BinaryExpression(5, "residue", 8), 5],
  ["folds /", new ast.BinaryExpression(5, "sunder", 8), 0.625],
  ["folds **", new ast.BinaryExpression(5, "exponentiate", 8), 390625],
  ["folds <", new ast.BinaryExpression(5, "lesser", 8), true],
  ["folds <=", new ast.BinaryExpression(5, "tis lesser", 8), true],
  ["folds ==", new ast.BinaryExpression(5, "tis", 8), false],
  ["folds !=", new ast.BinaryExpression(5, "tis not", 8), true],
  ["folds >=", new ast.BinaryExpression(5, "tis greater", 8), false],
  ["folds >", new ast.BinaryExpression(5, "greater", 8), false],
  ["optimizes +0", new ast.BinaryExpression(x, "with", 0), x],
  ["optimizes -0", new ast.BinaryExpression(x, "without", 0), x],
  ["optimizes *1", new ast.BinaryExpression(x, "accumulate", 1), x],
  ["optimizes /1", new ast.BinaryExpression(x, "sunder", 1), x],
  ["optimizes *0", new ast.BinaryExpression(x, "accumulate", 0), 0],
  ["optimizes 0*", new ast.BinaryExpression(0, "accumulate", x), 0],
  ["optimizes 0/", new ast.BinaryExpression(0, "sunder", x), 0],
  ["optimizes 0+", new ast.BinaryExpression(0, "with", x), x],
  ["optimizes 0-", new ast.BinaryExpression(0, "without", x), neg(x)],
  ["optimizes 1*", new ast.BinaryExpression(1, "accumulate", x), x],
  ["folds negation", new ast.UnaryExpression("-", 8), -8],
  ["optimizes 1**", new ast.BinaryExpression(1, "exponentiate", x), 1],
  ["optimizes **0", new ast.BinaryExpression(x, "exponentiate", 0), 1],
  ["removes left false from OR", or(false, less(x, 1)), less(x, 1)],
  ["removes right false from OR", or(less(x, 1), false), less(x, 1)],
  ["removes left true from &&", and(true, less(x, 1)), less(x, 1)],
  ["removes right true from &&", and(less(x, 1), true), less(x, 1)],
  ["removes x=x at beginning", [new ast.VariableAssignment(x, x), xpp], [xpp]],
  ["removes x=x at end", [xpp, new ast.VariableAssignment(x, x)], [xpp]],
  ["removes x=x in middle", [xpp, new ast.VariableAssignment(x, x), xpp], [xpp, xpp]],
  ["optimizes if-true", new ast.IfStatement(true, xpp, undefined, undefined, x), xpp],
   ["optimizes if-true (if-else)", new ast.IfStatement(true, xpp, true, xmm, x), xpp],
  ["optimizes if-false-true", new ast.IfStatement(false, xpp, true, xmm, x), xmm],
  ["optimizes if-false-false", new ast.IfStatement(false, xpp, false, xmm, x), x],
  ["optimizes if-false-false-none", new ast.IfStatement(false, xpp, false, xmm, undefined), []],
  ["optimizes if-false", new ast.IfStatement(false, x, undefined, undefined, xpp), xpp],
  ["optimizes short-if-true", new ast.IfStatement(true, xmm, undefined, undefined, undefined), xmm],
  ["optimizes short-if-false", [new ast.IfStatement(false, xpp, undefined, undefined, undefined)], []],
  ["optimizes while-false", [new ast.WhileLoop(false, xpp)], []],
  ["optimizes for-loop w/ false condition", [new ast.ForLoop(x, false, xpp, xmm)], []],
  ["applies if-false after folding", new ast.IfStatement(eq(1, 1), xpp), xpp],
  ["optimizes in functions", intFun(return1p1), intFun(return2)],
  ["optimizes array lookups (subscript expression)", sub(x, onePlusTwo), sub(x, 3)],
  ["optimizes in array literals", array(0, onePlusTwo, 9), array(0, 3, 9)],
  ["optimizes in arguments", callIdentity([times(3, 5)]), callIdentity([15])],

  
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill([
      new ast.Program([new ast.Return()]),
      new ast.VariableInitialization("Lexicographical", "forns", "k'toot"),
      new ast.VariableAssignment(x, new ast.BinaryExpression(x, "with", "z")),
      new ast.VariableAssignment(x, new ast.UnaryExpression("absolutization", x)),
      new ast.Call(identity, new ast.ArrayLookup(x, "f")),
      new ast.Numeral(44),
      new ast.VariableInitialization("Numeral", "x", 0),
      new ast.WhileLoop(true, [new ast.Break()]),
      new ast.IfStatement(bool, undefined, undefined, undefined, undefined),
      new ast.ForLoop(x, less(x, 15), xpp, xmm),
    ]),
  ],
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})