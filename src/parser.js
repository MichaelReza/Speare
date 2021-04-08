import fs from "fs"
import ohm from "ohm-js"
import * as ast from "./ast.js"

const grammar = ohm.grammar(fs.readFileSync("./src/grammar.ohm"))

const astBuilder = grammar.createSemantics().addOperation("ast", {
  Program(statements) {
    return new ast.Program(statements.ast())
  },
  Composition_class(_composition, id, _sb, compBody, _eb) {
    return new ast.Composition(id.sourceString, compBody.ast())
  },
  Corollary_function(
    _enter,
    type,
    id,
    _sb,
    params,
    _eb,
    _sbrace,
    body,
    _eBrace
  ) {
    return new ast.Corollary(
      type.sourceString,
      id.sourceString,
      params.asIteration().ast(),
      body.ast()
    )
  },
  Statement_variable(_allow, type, id, _be, relExp) {
    return new ast.VariableInitialization(
      type.sourceString,
      id.sourceString,
      relExp.ast()
    )
  },
  Statement_assignment(id, _be, relExp) {
    return new ast.VariableAssignment(id.sourceString, relExp.ast())
  },
  Statement_print(_print, _sp, relExp, _ep) {
    return new ast.Print(relExp.ast())
  },
  Statement_return(_return, id) {
    return new ast.Return(id.sourceString)
  },
  Statement_incdecby(id, op, relExp) {
    return new ast.IncDecby(id.sourceString, op.sourceString, relExp.ast())
  },
  Statement_incdec(id, op) {
    return new ast.IncDec(id.sourceString, op.sourceString)
  },
  ContFlow_complexconditional(
    _if,
    _sp,
    le1,
    _ep,
    _sb,
    body,
    _eb,
    _elif,
    _sp2,
    le2,
    _ep2,
    _sb2,
    body2,
    _eb2,
    _else,
    _sb3,
    body3,
    _eb3
  ) {
    return new ast.IfStatement(
      _if.sourceString,
      le1.ast(),
      body.ast(),
      _elif.sourceString,
      le2.ast(),
      body2.ast(),
      _else.sourceString,
      body3.ast()
    )
  },
  ContFlow_switchcase(swtch, factor, _sb, cse, factor2, _col, body, brk, _eb) {
    return new ast.SwitchStatement(
      swtch.sourceString,
      factor.ast(),
      cse.sourceString,
      factor2.ast(),
      body.ast(),
      brk.sourceString
    )
  },
  ContFlow_forloop(
    _for,
    _sp,
    s1,
    _comma,
    s2,
    _comma2,
    s3,
    _ep,
    _sb,
    body,
    _eb
  ) {
    return new ast.ForLoop(
      _for.sourceString,
      s1.ast(),
      s2.ast(),
      s3.ast(),
      body.ast()
    )
  },
  ContFlow_forin(_for, _sp, var1, _in, var2, _ep, _sb, body, _eb) {
    return new ast.ForIn(_for.sourceString, var1.ast(), var2.ast(), body.ast())
  },
  ContFlow_while(whle, _sp, logicExp, _ep, _sb, body, _eb) {
    return new ast.WhileLoop(whle.sourceString, logicExp.ast(), body.ast())
  },
  ContFlow_dowhile(doo, _sb, body, brk, _eb, whle, _sp, logExp, _ep) {
    return new ast.DoWhile(
      doo.sourceString,
      body.ast(),
      brk.sourceString,
      whle.sourceString,
      logExp.ast()
    )
  },
  LogicExp_logicalcombo(lexp, op, rexp) {
    return new ast.BinaryExpression(lexp.ast(), op.sourceString, rexp.ast())
  },
  RelExp_equality(addsub, op, multdiv) {
    return new ast.BinaryExpression(
      addsub.ast(),
      op.sourceString,
      multdiv.ast()
    )
  },
  AddSub_addorsubtract(addsub, op, multdiv) {
    return new ast.BinaryExpression(
      addsub.ast(),
      op.sourceString,
      multdiv.ast()
    )
  },
  MultDiv_multordiv(multdiv, op, expo) {
    return new ast.BinaryExpression(multdiv.ast(), op.sourceString, expo.ast())
  },
  Exponentiate_raisepower(factor, op, expo) {
    return new ast.BinaryExpression(factor.ast(), op.sourceString, expo.ast())
  },
  Factor_parens(_sp, addSub, _cp) {
    return new ast.BinaryExpression(addSub.ast())
  },
  Factor_unary(sign, _sp, factor, _cp) {
    return new ast.UnaryExpression(sign.sourceString, factor.ast())
  },
  // Factor_Types(type) {
  //   return new ast.UnaryAssignment(type.ast())
  // },
  Param(type, varname) {
    return new ast.Param(type.sourceString, varname.sourceString)
  },
  Varname(id) {
    return new ast.IdentifierExpression(id.sourceString)
  },
  String_string(_squote, str, _equote) {
    return new ast.StringValue(str.sourceString)
  },
  Tobeornottobe(value) {
    return new ast.Tobeornottobe(value.sourceString)
  },
  Numeral(_whole, _dot, _fractional) {
    return new ast.Numeral(Number(this.sourceString))
  },
  // [ Numeral, 1 ]
  Liste(_sb, values, _eb) {
    return new ast.Liste(values.asIteration().ast())
  },
  Concordance(_sb, dictItems, _eb) {
    return new ast.Concordance(dictItems.asIteration().ast())
  },
  DictItem_dictionaryitem(key, _colon, val) {
    return new ast.DictItem(key.ast(), val.ast())
  },
  _terminal() {
    return null
  },
})

export default function parse(sourceCode) {
  const match = grammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}

// export default function parse(source) {
//   const match = grammar.match(source)
//   return match.succeeded()
// }
