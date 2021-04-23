// Code Generator Speare -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

import { IncDec } from "./ast.js"

export default function generate(program) {
  const output = []

  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in Carlos,
  // but not in JS. So, the Carlos variable "switch" must become something
  // like "switch_1". We handle this by mapping each name to its suffix.
  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name ?? entity.description}_${mapping.get(entity)}`
    }
  })(new Map())

  // A very handy tool that maps our operators to JS operators :)
  const OPERATORS = { 
        "tis": "===",
        "tis not": "!==",
        "tis nobler" : ">=",
        "tis lesser" : "<=",
        "nobler" : ">",
        "lesser" : "<",
        "with" : "+",
        "without" : "-",
        "accumulate" : "*",
        "sunder" : "/",
        "residue" : "%",
        "exponentiate" : "**",
      }

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.statements)
    },
    Type(t) {
      //Type generator
    },
    ListeType(t) {
      //Liste Type Generator
    },
    ConcordanceType(t) {
      //Concordance Type Generator
    },
    CorollaryType(t) {
      //Corollary Type Generator
    },
    Composition(c) {
      //Composition Generator
    },
    Corollary(f) {
      return targetName(f)
    },
    Param(p) {
      //Parameter Generator
    },
    IfStatement(s) {
      //If Statement Generator
    },
    SwitchStatement(s) {
      //Switch Statement Generator
    },
    ForLoop(f) {
      // For Loop Generator
    },
    WhileLoop(w) {
      // While Loop Generator
    },
    DoWhile(d) {
      // Do-While Loop Generator
    },
    VariableInitialization(v) {
      // Variable Init Generator
    },
    VariableAssignment(s) {
      output.push(`${gen(s.name)} = ${gen(s.value)};`)
    },
    Variable(v) {
      return targetName(v)
    },
    Print(e) {
      // Print Generator
    },
    Return(e) {
      // Return Generator
    },
    Break(b) {
      output.push("break;")
    },
    IncDecBy(i) {
      if (i.op === "incrementby") {
        output.push(`${gen(i.variable)}+=${gen(i.expression)};`)
      } else {
        output.push(`${gen(i.variable)}-=${gen(i.expression)};`)
      }
    },
    IncDec(i) {
      if (i.op === "increment") {
        output.push(`${gen(i.variable)}++;`)
      } else {
        output.push(`${gen(i.variable)}--;`)
      }
    },
    BinaryExpression(b) {
      const OP = OPERATORS[e.op] ?? e.op
      return `(${gen(e.left)} ${OP} ${gen(e.right)})`
    },
    UnaryExpression(u) {
      if (u.sign === "nay") {
        `!(${gen(u.value)})`
      } else if (u.sign === "absolutization") {
        return `Math.abs(${gen(u.value)})`
      } else {
        return `Math.sqrt(${gen(u.value)})`
      }
    },
    UnaryAssignment(v) {
      // Unary Assignment Generator
    },
    IdentifierExpression(n) {
      // Identifier Expression Generator
    },
    StringValue(s) {
      return JSON.stringify(s)
    },
    Liste(a) {
      return a.map(gen)
    },
    ArrayLookup(a) {
      // Liste Lookup Generator
    },
    DictLookup(d) {
      // Concordance Lookup Generator
    },
    Call(c) {
      // Call Generator
    },
    Numeral(n) {
      return n
    },
    Lexicographical(s) {
      return JSON.stringify(s)
    },
    Tobeornottobe(t) {
      if (t === "fallacious") {
        return false
      } else {
        return true
      }
    },
    Concordance(c) {
      // Concordance Generator
    },
    DictEntry(d) {
      // DictEntry Generator
    },
    NonEmptyList(a) {
      // NonEmptyList Generator
    },

    /** REFERENCE MATERIAL ONLY
     * I wrapped all of the original carlos functions in this Carlos() function
     * so that it is collapsable. All of the functions in here are a good reference
     * on what to do, we just need to convert it to Speare. Of course, they do *not*
     * directly translate. We may also have differing features.
     */
    Carlos() {
      // VariableDeclaration(d) {
      // // We don't care about const vs. let in the generated code! The analyzer has
      // // already checked that we never updated a const, so let is always fine.
      // output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`)
      // },
      // TypeDeclaration(d) {
      //   output.push(`class ${gen(d.type)} {`)
      //   output.push(`constructor(${gen(d.type.fields).join(",")}) {`)
      //   for (let field of d.type.fields) {
      //     output.push(`this[${JSON.stringify(gen(field))}] = ${gen(field)};`)
      //   }
      //   output.push("}")
      //   output.push("}")
      // },
      // StructType(t) {
      //   return targetName(t)
      // },
      // Field(f) {
      //   return targetName(f)
      // },
      // FunctionDeclaration(d) {
      //   output.push(`function ${gen(d.fun)}(${gen(d.fun.parameters).join(", ")}) {`)
      //   gen(d.body)
      //   output.push("}")
      // },
      // Parameter(p) {
      //   return targetName(p)
      // },
      // Variable(v) {
      //   return targetName(v)
      // },
      // Function(f) {
      //   return targetName(f)
      // },
      // Increment(s) {
      //   output.push(`${gen(s.variable)}++;`)
      // },
      // Decrement(s) {
      //   output.push(`${gen(s.variable)}--;`)
      // },
      // Assignment(s) {
      //   output.push(`${gen(s.target)} = ${gen(s.source)};`)
      // },
      // BreakStatement(s) {
      //   output.push("break;")
      // },
      // ReturnStatement(s) {
      //   output.push(`return ${gen(s.expression)};`)
      // },
      // ShortReturnStatement(s) {
      //   output.push("return;")
      // },
      // IfStatement(s) {
      //   output.push(`if (${gen(s.test)}) {`)
      //   gen(s.consequent)
      //   if (s.alternate.constructor === IfStatement) {
      //     output.push("} else")
      //     gen(s.alternate)
      //   } else {
      //     output.push("} else {")
      //     gen(s.alternate)
      //     output.push("}")
      //   }
      // },
      // ShortIfStatement(s) {
      //   output.push(`if (${gen(s.test)}) {`)
      //   gen(s.consequent)
      //   output.push("}")
      // },
      // WhileStatement(s) {
      //   output.push(`while (${gen(s.test)}) {`)
      //   gen(s.body)
      //   output.push("}")
      // },
      // RepeatStatement(s) {
      //   // JS can only repeat n times with a counter variable!
      //   const i = targetName({ name: "i" })
      //   output.push(`for (let ${i} = 0; ${i} < ${gen(s.count)}; ${i}++) {`)
      //   gen(s.body)
      //   output.push("}")
      // },
      // ForRangeStatement(s) {
      //   const i = targetName(s.iterator)
      //   const op = s.op === "..." ? "<=" : "<"
      //   output.push(`for (let ${i} = ${gen(s.low)}; ${i} ${op} ${gen(s.high)}; ${i}++) {`)
      //   gen(s.body)
      //   output.push("}")
      // },
      // ForStatement(s) {
      //   output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`)
      //   gen(s.body)
      //   output.push("}")
      // },
      // Conditional(e) {
      //   return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(e.alternate)}))`
      // },
      // BinaryExpression(e) {
      //   const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op
      //   return `(${gen(e.left)} ${op} ${gen(e.right)})`
      // },
      // UnaryExpression(e) {
      //   return `${e.op}(${gen(e.operand)})`
      // },
      // SubscriptExpression(e) {
      //   return `${gen(e.array)}[${gen(e.index)}]`
      // },
      // ArrayExpression(e) {
      //   return `[${gen(e.elements).join(",")}]`
      // },
      // EmptyArray(e) {
      //   return "[]"
      // },
      // MemberExpression(e) {
      //   return `(${gen(e.object)}[${JSON.stringify(gen(e.field))}])`
      // },
      // Call(c) {
      //   const targetCode = standardFunctions.has(c.callee)
      //     ? standardFunctions.get(c.callee)(gen(c.args))
      //     : c.callee.constructor === StructType
      //     ? `new ${gen(c.callee)}(${gen(c.args).join(", ")})`
      //     : `${gen(c.callee)}(${gen(c.args).join(", ")})`
      //   // Calls in expressions vs in statements are handled differently
      //   if (c.callee instanceof Type || c.callee.type.returnType !== Type.VOID) {
      //     return targetCode
      //   }
      //   output.push(`${targetCode};`)
      // },
      // Numeral(e) {
      //   return e
      // },
      // ToBeOrNotToBe(e) {
      //   return e
      // },
      // Lexicographical(e) {
      //   // This ensures in JavaScript they get quotes!
      //   return JSON.stringify(e)
      // },
      // Liste(a) {
      //   return a.map(gen)
      // }
    },
  }

  gen(program)
  return output.join("\n")
}