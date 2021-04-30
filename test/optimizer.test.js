import assert from "assert/strict"
import optimize from "../src/optimizer.js"
import * as ast from "../src/ast.js"

// Make some test cases easier to read
const x = new ast.VariableInitialization("ToBeOrNotToBe", "x", false)
const xpp = new ast.IncDec(x, "increment")
const xmm = new ast.IncDec(x, "decrement")
const return1p1 = new ast.Return(new ast.BinaryExpression("+", 1, 1))
const return2 = new ast.Return(2)
const returnX = new ast.Return(x)
const onePlusTwo = new ast.BinaryExpression(1, "with", 2)
const body = returnX
const identity = Object.assign(new ast.Corollary("ToBeOrNotToBe", [], "foo", body))
const intFun = body => new ast.Corollary("f", [], "bar", body)
const callIdentity = args => new ast.Call(identity.id, args)
const or = (...d) => d.reduce((x, y) => new ast.BinaryExpression(x,"alternatively", y))
const and = (...c) => c.reduce((x, y) => new ast.BinaryExpression(x, "furthermore", y))
const less = (x, y) => new ast.BinaryExpression(x, "lesser", y)
const eq = (x, y) => new ast.BinaryExpression(x, "tis", y)
const times = (x, y) => new ast.BinaryExpression(x,"accumulate", y)
const neg = x => new ast.UnaryExpression("-", x)
const array = (...elements) => new ast.Liste(elements)
const emptyArray = new ast.Liste([])
const sub = (a, e) => new ast.Call(a, e)
const conditional = (x, y, z) => new ast.IfStatement(x, y, z)

const tests = [
  ["folds +", new ast.BinaryExpression(5, "with", 8), 13],
  ["folds -", new ast.BinaryExpression(5n, "without", 8n), -3n],
  ["folds *", new ast.BinaryExpression(5, "accumulate", 8), 40],
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
//   ["folds negation", new ast.UnaryExpression("-", 8), -8],
  ["optimizes 1**", new ast.BinaryExpression(1, "exponentiate", x), 1],
  ["optimizes **0", new ast.BinaryExpression(x, "exponentiate", 0), 1],
//   ["removes left false from OR", or(false, less(x, 1)), less(x, 1)],
//   ["removes right false from ||", or(less(x, 1), false), less(x, 1)],
//   ["removes left true from &&", and(true, less(x, 1)), less(x, 1)],
//   ["removes right true from &&", and(less(x, 1), true), less(x, 1)],
//   ["removes x=x at beginning", [new ast.Assignment(x, x), xpp], [xpp]],
//   ["removes x=x at end", [xpp, new ast.Assignment(x, x)], [xpp]],
//   ["removes x=x in middle", [xpp, new ast.Assignment(x, x), xpp], [xpp, xpp]],
//   ["optimizes if-true", new ast.IfStatement(true, xpp, []), xpp],
//   ["optimizes if-false", new ast.IfStatement(false, [], xpp), xpp],
//   ["optimizes short-if-true", new ast.ShortIfStatement(true, xmm), xmm],
//   ["optimizes short-if-false", [new ast.ShortIfStatement(false, xpp)], []],
//   ["optimizes while-false", [new ast.WhileStatement(false, xpp)], []],
//   ["optimizes repeat-0", [new ast.RepeatStatement(0, xpp)], []],
//   ["optimizes for-range", [new ast.ForRangeStatement(x, 5, "...", 3, xpp)], []],
//   ["optimizes for-empty-array", [new ast.ForStatement(x, emptyArray, xpp)], []],
//   ["applies if-false after folding", new ast.ShortIfStatement(eq(1, 1), xpp), xpp],
//   ["optimizes left conditional true", conditional(true, 55, 89), 55],
//   ["optimizes left conditional false", conditional(false, 55, 89), 89],
//   ["optimizes in functions", intFun(return1p1), intFun(return2)],
//   ["optimizes in subscripts", sub(x, onePlusTwo), sub(x, 3)],
//   ["optimizes in array literals", array(0, onePlusTwo, 9), array(0, 3, 9)],
//   ["optimizes in arguments", callIdentity([times(3, 5)]), callIdentity([15])],
//   [
//     "passes through nonoptimizable constructs",
//     ...Array(2).fill([
//       new ast.Program([new ast.ShortReturnStatement()]),
//       new ast.VariableDeclaration("x", true, "z"),
//       new ast.TypeDeclaration([new ast.Field("x", ast.Type.INT)]),
//       new ast.Assignment(x, new ast.BinaryExpression("*", x, "z")),
//       new ast.Assignment(x, new ast.UnaryExpression("not", x)),
//       new ast.Call(identity, new ast.MemberExpression(x, "f")),
//       new ast.VariableDeclaration("q", false, new ast.EmptyArray(ast.Type.FLOAT)),
//       new ast.VariableDeclaration("r", false, new ast.EmptyOptional(ast.Type.INT)),
//       new ast.WhileStatement(true, [new ast.BreakStatement()]),
//       new ast.RepeatStatement(5, [new ast.ReturnStatement(1)]),
//       conditional(x, 1, 2),
//       unwrapElse(some(x), 7),
//       new ast.IfStatement(x, [], []),
//       new ast.ShortIfStatement(x, []),
//       new ast.ForRangeStatement(x, 2, "..<", 5, []),
//       new ast.ForStatement(x, array(1, 2, 3), []),
//     ]),
//   ],
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})