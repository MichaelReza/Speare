import fs from "fs"
import ohm from "ohm-js"

const grammar = ohm.grammar(fs.readFileSync("./src/grammar.ohm"))

// const astBuilder = aelGrammar.createSemantics().addOperation("ast", {
//   Program(works, statements) {
//     return new ast.Program(works.ast(), statements.ast)
//   },
//   Composition(_composition, id, _sb, compBody, _eb) {
//     return new ast.Composition(id.sourceString, compBody.ast())
//   },
//   Corollary(_enter, _type, id, _sb, params,  _eb, _sbrace, body, _eBrace) {
//     return new ast.Corollary(id.sourceString, params.asIteration().ast(), body.ast())
//   },
//   Statement_Control(contFlow) {
//     return new ast.Statement(contFlow.ast())
//   },
//   Statement_Initializer(_allow, id, _be, relExp) {
//     return new ast.Statement(id.sourceString, relExp.ast())
//   },
//   Statement_Assignment_RelExp(id, _be, relExp) {
//     return new ast.Statement(id.sourceString, relExp.ast())
//   },
//   Statement_Assignment_Statement(id, _be, statement) {
//     return new ast.Statement(id.sourceString, statement.ast())
//   },
//   Statement_print(_print, relExp, _ep) {
//     return new ast.Statement(relExp.ast())
//   },
//   Statement_Return_Var(_return, id) {
//     return new ast.Statement(id.sourceString)
//   },
//   Statement_Return_RelExp(_return, relExp) {
//     return new ast.Statement(relExp.ast())
//   },
//   Statement_IncDecBy(id, op, relExp) {
//     return new ast.Statement(id.sourceString, op.sourceString, relExp.ast())
//   },
//   Statement_IncDec(id, op) {
//     return new ast.Statement(id.sourceString, op.sourceString)
//   },
//   ContFlow(left, op, right) {
//     return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
//   },
//   LogicExp(op, operand) {
//     return new ast.UnaryExpression(op.sourceString, operand.ast())
//   },
//   RelExp(_open, expression, _close) {
//     return expression.ast()
//   },
//   AddSub(_open, expression, _close) {
//     return expression.ast()
//   },
//   MultDiv(_open, expression, _close) {
//     return expression.ast()
//   },
//   Exponentiate(_open, expression, _close) {
//     return expression.ast()
//   },
//   Factor(_open, expression, _close) {
//     return expression.ast()
//   },
  
//   Var(id) {
//     return new ast.IdentifierExpression(this.sourceString)
//   },
//   num(_whole, _point, _fraction) {
//     return Number(this.sourceString)
//   },
// })

// export default function parse(sourceCode) {
//   const match = aelGrammar.match(sourceCode)
//   if (!match.succeeded()) {
//     throw new Error(match.message)
//   }
//   return astBuilder(match).ast()
// }

export default function parse(source) {
  const match = grammar.match(source)
  return match.succeeded()
}