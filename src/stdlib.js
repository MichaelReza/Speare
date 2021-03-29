import {Type} from "./ast.js"
// Import classes that will be used in stdlib

// function makeConstant(name, type, value) {
//   return Object.assign(new Variable(name, true), { type, value })
// }

// function makeFunction(name, type) {
//   return Object.assign(new Function(name), { type })
// }

// export const functions = {
//     print: makeFunction("print", new FunctionType([Type.ANY], Type.VOID)),
//     sin: makeFunction("sin", floatFloatType),
//     cos: makeFunction("cos", floatFloatType),
//     exp: makeFunction("exp", floatFloatType),
//     ln: makeFunction("ln", floatFloatType),
//     hypot: makeFunction("hypot", floatFloatFloatType),
//     bytes: makeFunction("bytes", stringToIntsType),
//     codepoints: makeFunction("codepoints", stringToIntsType),
// }

// function makeFunction(name, type) {
//   return Object.assign(new Function(name), { type })
// }

export const types = {
  number: Type.NUMERAL,
  boolean: Type.BOOLEAN,
  string: Type.STRING,
  null: Type.NULL,
  type: Type.TYPE
}

// export const functions = {
//     speaketh: makeFunction(/* Print.expression */"speaketh", new FunctionType([Type.Any], Type.Indistinguishable))
//     abs: makeFunction("absolutization", new FunctionType([Type.]))
//     sqrt: makeFunction("quadrangle", )
// }


// ``` 
//   [TODO]:
//     Pick classes to include in stdlib that will be imported into the analyzer
//     (types, constants, functions)
// ```
// ```
// - Type
//   - number
//   - boolean
//   - string
//   - null
//   - type  
// Program
// Composition 
// Corollary
// Param
// IfStatement  
// SwitchStatement
// ForLoop
// ForIn
// WhileLoop 
// DoWhile
// VariableInitialization 
// VariableAssignment
// Print
// Return
// IncDecby
// IncDec 
// BinaryExpression
// UnaryExpression
// IdentifierExpression
// StringValue
// BasicType 
// Liste
// Concordance 
// DictItem
// NonEmptyList
// ```