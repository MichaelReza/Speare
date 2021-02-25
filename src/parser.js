import fs from "fs"
import ohm from "ohm-js"
import { BinaryExpression } from "./ast"

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
  ContFlow_Switch(swtch, factor, _sb, cse, factor2, _col, body, brk, _eb) {
    return new ast.ContFlow(swtch.sourceString, factor.ast(), cse.sourceString, factor2.ast(), body.ast(), brk.sourceString)
  },
  ContFlow_For(_for, _sp, s1, _comma, s2, _comma2, s3, _ep, _sb, body, brk, _eb) {
    return new ast.ContFlow(_for.sourceString, s1.ast(), s2.ast(), s3.ast(), body.ast(), brk.sourceString)
  },
  ContFlow_ForIn(_for, _sp, var1, _in, var2, _ep, _sb, body, brk, _eb) {
    return new ast.ContFlow(_for.sourceString, var1.ast(), var2.ast(), body.ast(), brk.sourceString)
  },
  ContFlow_While(whle, _sp, logicExp, _ep, _sb, body, brk, _eb) {
    return new ast.ContFlow(whle.sourceString, logicExp.ast(), body.ast(), brk.sourceString)
  },
  ContFlow_Do(doo, _sb, body, brk, _eb, whle, _sp, logExp, _ep) {
    return new ast.ContFlow(doo.sourceString, body.ast(), brk.sourceString, whle.sourceString, logExp.ast())
  },
  LogicExp(lexp, op, rexp) {
    return new BinaryExpression(lexp.ast(), op.sourceString, rexp.ast())
  },
  RelExp(addsub, op, multdiv) {
    return new BinaryExpression(addsub.ast(), op.sourceString, multdiv.ast())
  },
  AddSub(addsub, op, multdiv) {
    return new BinaryExpression(addsub.ast(), op.sourceString, multdiv.ast())
  },
  MultDiv(multdiv, op, expo) {
    return new MultDiv(multdiv.ast(), op.sourceString, expo.ast())
  },
  Exponentiate(factor, op, expo) {
    return new ast.Expo(factor.ast(), op.sourceString, expo.ast())
  },
  Factor_AddSub(_sp, addSub, _cp) {
    return new ast.AddSub(addSub.ast())
  },
  Factor_Factor(sign, _sp, factor, _cp) {
    return new ast.Factor(sign.sourceString, factor.ast())
  },
  Param(type, varname) {
    return new ast.Param(type.ast(), varname.sourceString)
  },
  Varname(id) {
    return new ast.IdentifierExpression(this.sourceString)
  },
  Type_Primitive(primitiveType) {
    return new ast.Type(primitiveType.ast())
  },
  Type_DS(dsType) {
    return new ast.Type(dsType.ast())
  }
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