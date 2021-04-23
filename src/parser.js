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
      type.ast(),
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
  Statement_return(_return, relExp) {
    return new ast.Return(relExp.ast())
  },
  Statement_break(_break) {
    return new ast.Break()
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
      le1.ast(),
      body.ast(),
      le2.ast(),
      body2.ast(),
      body3.ast()
    )
  },
  ContFlow_forloop(
    _for,
    _sp,
    init,
    _comma,
    condition,
    _comma2,
    action,
    _ep,
    _sb,
    body,
    _eb
  ) {
    return new ast.ForLoop(
      init.ast(),
      condition.ast(),
      action.ast(),
      body.ast()
    )
  },
  ContFlow_while(_whle, _sp, logicExp, _ep, _sb, body, _eb) {
    return new ast.WhileLoop(logicExp.ast(), body.ast())
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
  Factor_variablename(neg, name) {
    return new ast.IdentifierExpression(neg, name)
  },
  Factor_parens(_sp, addSub, _cp) {
    return new ast.Parenthesized(addSub.ast())
  },
  Factor_unary(sign, _sp, factor, _cp) {
    return new ast.UnaryExpression(sign.sourceString, factor.ast())
  },
  Param(type, name) {
    return new ast.Param(type.ast(), name.sourceString)
  },
  Varname(id) {
    return new ast.IdentifierExpression(null, id.sourceString)
  },
  ArrayLookup(array, _sb, index, _eb) {
      return new ast.ArrayLookup(array.ast(), index.ast())
  },
  DictLookup(dict, _dot, key) {
    return new ast.DictLookup(dict.ast(), key.ast())
  },
  FunctionCall(varname, _sp, args, _ep) {
    return new ast.Call(varname.sourceString, args.asIteration().ast())
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
  Lexicographical(_squote, str, _equote) {
    return new ast.StringValue(str.sourceString)
  },
  // [ Numeral, 1 ]
  Liste(_sb, values, _eb) {
    return new ast.Liste(values.asIteration().ast())
  },
  Concordance(_sb, dictItems, _eb) {
    return new ast.Concordance(dictItems.asIteration().ast())
  },
  DictEntry(key, _colon, val) {
    return new ast.DictEntry(key.ast(), val.ast())
  },
  type_listdec(_listof, type){
    return new ast.ListeType(type.ast())
  },
  type_dictdec(_concof, keytype, _of, valuetype) {
    return new ast.ConcordanceType(keytype.ast(), valuetype.ast())
  },
  _terminal() {
    return this.sourceString
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
