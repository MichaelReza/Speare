// // Abstract Syntax Tree Nodes
// //
// // This module defines classes for the AST nodes. Only the constructors are
// // defined here. Semantic analysis methods, optimization methods, and code
// // generation are handled by other modules. This keeps the compiler organized
// // by phase.
// //
// // The root (Program) node has a custom inspect method, so you can console.log
// // the root node and you'll get a lovely formatted string with details on the
// // entire AST. It even works well if you analyze the AST and turn it into a
// // graph with cycles.

import util from "util"

export class Program {
  constructor(statements) {
    this.statements = statements
  }
  [util.inspect.custom]() {
    return prettied(this)
  }
}

export class Type {
  constructor(name) {
    this.name = name
  }
  static BOOLEAN = new Type("ToBeOrNotToBe")
  static NUMERAL = new Type("Numeral")
  static STRING = new Type("Lexicographical")
  static VOID = new Type("Indistinguishable")
  static NULL = new Type("Illused")
  static TYPE = new Type("type")
  // Equivalence: Iwhen are two types the same
  tis(target) {
    return this == target
  }

  tisAssignable(target) {
    return this.isEquivalentTo(target)
  }
}

export class ListeType extends Type {
  // Example: [int]
  constructor(baseType) {
    super(`[${baseType.name ?? baseType}]`)
    this.baseType = baseType
  }
  // [T] equivalent to [U] only when T is equivalent to U. Same for
  // assignability: we do NOT want arrays to be covariant!
  tis(target) {
    return target.constructor === ListeType && this.baseType === target.baseType
  }
}

export class ConcordanceType extends Type {
  constructor(keyType, valType) {
    super(`[${keyType.name ?? keyType}:${valType.name ?? valType}]`)
    this.keyType = keyType
    this.valType = valType
  }
  // [T] equivalent to [U] only when T is equivalent to U. Same for
  // assignability: we do NOT want arrays to be covariant!
  tis(target) {
    return (
      target.constructor === ConcordanceType &&
      this.keyType === target.keyType &&
      this.valType === target.valType
    )
  }
}

export class CorollaryType extends Type {
  // Example: (boolean,[string]?)->float
  constructor(name, parameterTypes, type) {
    super(
      `(${parameterTypes.map((t) => t.name).join(",")})->${type.name}`
    )
    Object.assign(this, { name, parameterTypes, type })
  }
  tisAssignable(target) {
    return (
      target.constructor === CorollaryType &&
      this.type.tisAssignable(target.type) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) =>
        target.parameterTypes[i].tisAssignable(t)
      )
    )
  }
}

export class Composition {
  constructor(id, compBody) {
    Object.assign(this, { id, compBody })
  }
}

export class Corollary {
  constructor(type, id, params, body) {
    Object.assign(this, { type, id, params, body })
  }

  // get returnType() {
  //   return this.type
  // }
}
export class Param {
  constructor(type, name) {
    Object.assign(this, { type, name })
  }
}

// ContFlow -----------------------------------------------------------------
export class IfStatement {
  constructor(le1, body, le2, body2, body3) {
    Object.assign(this, {le1, body, le2, body2, body3 })
  }
}

// export class SwitchStatement {
//   constructor(swtch, factor1, cse, factor2, body) {
//     Object.assign(this, { swtch, factor1, cse, factor2, body })
//   }
// }

export class ForLoop {
  constructor(init, condition, action, body) {
    Object.assign(this, { init, condition, action, body})
  }
}

export class ForLoopVariable {
  constructor(type, name, initializer) {
    Object.assign(this, { type, name, initializer })
  }
}

export class ForLoopAction {
  constructor(name, op) {
    Object.assign(this, { name, op })
  }
}

export class WhileLoop {
  constructor(logicExp, body) {
    Object.assign(this, {logicExp, body})
  }
}

export class DoWhile {
  constructor(doo, body, whle, logExp) {
    Object.assign(this, { doo, body, whle, logExp })
  }
}
// End ContFlow --------------------------------------------

// Statement ------------------------------------------
export class VariableInitialization {
  constructor(type, name, initializer) {
    Object.assign(this, { type, name, initializer })
  }
}

export class VariableAssignment {
  constructor(name, value) {
    Object.assign(this, { name, value })
  }
}

export class Print {
  constructor(expression) {
    this.expression = expression
  }
}

export class Return {
  constructor(expression) {
    this.expression = expression
  }
}

export class Break {
}

export class IncDecby {
  constructor(name, op, expression) {
    Object.assign(this, { name, op, expression })
  }
}

export class IncDec {
  constructor(name, op) {
    Object.assign(this, { name, op })
  }
}
// End Statement -------------------------------

export class BinaryExpression {
  constructor(left, op, right) {
    Object.assign(this, { left, op, right })
  }
}

export class UnaryExpression {
  constructor(sign, value) {
    Object.assign(this, { sign, value })
  }
}

export class IdentifierExpression {
  constructor(name) {
    this.name = name
  }
}

export class StringValue {
  constructor(value) {
    this.value = value
    this.name = "Lexicographical"
  }
}

export class Liste {
  constructor(values) {
    Object.assign(this, { values })
  }
}

export class ArrayLookup {
  constructor(array, index) {
    Object.assign(this, { array, index })
  }
}

export class DictLookup {
  constructor(dict, key) {
    Object.assign(this, { dict, key })
  }
}

export class Call {
  constructor(varname, args) {
    Object.assign(this, { varname, args })
  }
  set setType(t) {
    this.type = t
  }
  set setParent(p) {
    this.parent = p
  }
}

export class StatementCall {
  constructor(varname, args) {
    Object.assign(this, { varname, args })
  }
  set setType(t) {
    this.type = t
  }
  set setParent(p) {
    this.parent = p
  }
}

export class Numeral {
  constructor(value) {
    Object.assign(this, { value })
    this.name = "Numeral"
  }
}

export class Tobeornottobe {
  constructor(value) {
    this.value = value
  }
}

export class Concordance {
  constructor(dictEntries) {
    this.type = "[" + dictEntries[0].key.name + ":" + dictEntries[0].val.name + "]"
    Object.assign(this, { dictEntries })
  }
}

export class DictEntry {
  constructor(key, val) {
    Object.assign(this, { key, val })
  }
}
// Source:
function prettied(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const tags = new Map()

  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return
    tags.set(node, tags.size + 1)
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child)
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`
      if (Array.isArray(e)) return `[${e.map(view)}]`
      return util.inspect(e)
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""]
      Object.entries(node).forEach(([k, v]) => (props += ` ${k}=${view(v)}`))
      yield `${String(id).padStart(4, " ")} | ${type}${props}`
    }
  }

  tag(node)
  return [...lines()].join("\n")
}
