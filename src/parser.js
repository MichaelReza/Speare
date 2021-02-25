import fs from "fs"
import ohm from "ohm-js"

const grammar = ohm.grammar(fs.readFileSync("./src/grammar.ohm"))

const astBuilder = aelGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new ast.Program(body.ast())
  },
  Composition(_composition, id, _sb, compBody, _eb) {
    return new ast.Composition(id.sourceString, compBody.ast())
  },
  CompositionNoComp(compBody) {
    return new ast.Composition(compBody.ast())
  },
  Corollary(_enter, _type, id, _sb, params,  _eb, _sbrace, body, _eBrace) {
    return new ast.Corollary(id.sourceString, params.asIteration().ast(), body.ast())
  },
  Body(_print, argument) {
    return new ast.PrintStatement(argument.ast())
  },
  Statement(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  ContFlow(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  LogicExp(op, operand) {
    return new ast.UnaryExpression(op.sourceString, operand.ast())
  },
  RelExp(_open, expression, _close) {
    return expression.ast()
  },
  AddSub(_open, expression, _close) {
    return expression.ast()
  },
  MultDiv(_open, expression, _close) {
    return expression.ast()
  },
  Exponentiate(_open, expression, _close) {
    return expression.ast()
  },
  Factor(_open, expression, _close) {
    return expression.ast()
  },
  
  Var(id) {
    return new ast.IdentifierExpression(this.sourceString)
  },
  num(_whole, _point, _fraction) {
    return Number(this.sourceString)
  },
})

export default function parse(sourceCode) {
  const match = aelGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}

export default function parse(source) {
  const match = grammar.match(source)
  return match.succeeded()
}