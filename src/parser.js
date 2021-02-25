import fs from "fs"
import ohm from "ohm-js"

const grammar = ohm.grammar(fs.readFileSync("./src/grammar.ohm"))

const astBuilder = aelGrammar.createSemantics().addOperation("ast", {
  Program(works, statements) {
    return new ast.Program(works.ast(), statements.ast)
  },
  Composition(_composition, id, _sb, compBody, _eb) {
    return new ast.Composition(id.sourceString, compBody.ast())
  },
  Corollary(_enter, type, id, _sb, params,  _eb, _sbrace, body, _eBrace) {
    return new ast.Corollary(id.sourceString, type.sourceString, params.asIteration().ast(), body.ast())
  },
  Statement_Control(contFlow) {
    return new ast.Statement(contFlow.ast())
  },
  Statement_Initializer(_allow ,type, id, _be, relExp) {
    return new ast.Statement(id.sourceString, type.sourceString, relExp.ast())
  },
  Statement_Assignment_RelExp(id, _be, relExp) {
    return new ast.Statement(id.sourceString, relExp.ast())
  },
  Statement_Assignment_Statement(id, _be, statement) {
    return new ast.Statement(id.sourceString, statement.ast())
  },
  Statement_print(_print, relExp, _ep) {
    return new ast.Statement(relExp.ast())
  },
  Statement_Return_Var(_return, id) {
    return new ast.Statement(id.sourceString)
  },
  Statement_Return_RelExp(_return, relExp) {
    return new ast.Statement(relExp.ast())
  },
  Statement_IncDecBy(id, op, relExp) {
    return new ast.Statement(id.sourceString, op.sourceString, relExp.ast())
  },
  Statement_IncDec(id, op) {
    return new ast.Statement(id.sourceString, op.sourceString)
  },
  ControlFlow_If(_if, _sp, le1, _ep, _sb, body, _eb,
                        _elif, _sp2, le2, _ep2, _sb2, body2, _eb2,
                        _else, _sb3, body3, _eb3) {
    return new ast.ContFlow(_if.sourceString, le1.ast(), body.ast(),
                            _elif.sourceString, le2.ast(), body2.ast(),
                            _else.sourceString, body3.ast())
  },  
  ContFlow_For(_for, _sp, s1, _comma, s2, _comma2, s3, _ep, _sb, body, brk, _eb) {
    return new ast.ContFlow(_for.sourceString, s1.ast(), s2.ast(), s3.ast(), body.ast(), brk.sourceString)
  },
  ContFlow_Switch(_switch, factor, _sb, _case, factor2, _col, body, brk, _eb) {
    return new ast.ContFlow(factor.ast(), factor2.ast, body.ast(), brk.sourceString)
  },
  // LogicExp(op, operand) {
  //   return new ast.UnaryExpression(op.sourceString, operand.ast())
  // },
  // RelExp(_open, expression, _close) {
  //   return expression.ast()
  // },
  // AddSub(_open, expression, _close) {
  //   return expression.ast()
  // },
  // MultDiv(_open, expression, _close) {
  //   return expression.ast()
  // },
  // Exponentiate(_open, expression, _close) {
  //   return expression.ast()
  // },
  // Factor(_open, expression, _close) {
  //   return expression.ast()
  // },
  
  // Var(id) {
  //   return new ast.IdentifierExpression(this.sourceString)
  // },
  // num(_whole, _point, _fraction) {
  //   return Number(this.sourceString)
  // },
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