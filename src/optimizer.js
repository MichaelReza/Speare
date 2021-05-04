// Optimizer
//
// This module exports a single function to perform machine-independent
// optimizations on the analyzed semantic graph.

import * as ast from "./ast.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  Program(p) {
    p.statements = optimize(p.statements)
    return p
  },
  VariableInitialization(d) {
    d.initializer = optimize(d.initializer)
    return d
  },
  Corollary(d) {
    d.params = optimize(d.params)
    d.body = optimize(d.body)
    return d
  },
  Param(p) {
    return p
  },
  IncDec(s) {
    return s
  },
  VariableAssignment(s) {
    s.name = optimize(s.name)
    s.value = optimize(s.value)
    if (s.name === s.value) {
      return []
    }
    return s
  },
  Break(b) {
    return b
  },
  Return(e) {
    if (e.expression !== undefined) {
      e.expression = optimize(e.expression)
    }
    return e
  },
  IfStatement(s) {
    s.le1 = optimize(s.le1)
    if (s.body !== undefined) {
      s.body = optimize(s.body)
    }
    if (s.le2 !== undefined) {
      s.le2 = optimize(s.le2)
      s.body2 = optimize(s.body2)
    }
    if (s.body3 !== undefined) {
      s.body3 = optimize(s.body3)
    }
    if (s.le1.constructor === Boolean && s.le2 === undefined) {
      return s.le1 ? s.body : (s.body3 !== undefined) ? s.body3 : []
    } else if (s.le1.constructor === Boolean && s.le2.constructor === Boolean) {
      return s.le1 ? s.body : s.le2 ? s.body2 : (s.body3 !== undefined) ? s.body3 : []
    }
    return s
  },
  WhileLoop(s) {
    s.logicExp = optimize(s.logicExp)
    if (s.logicExp === false) {
      return []
    }
    s.body = optimize(s.body)
    return s
  },
  ForLoop(s) {
    s.init = optimize(s.init)
    s.condition = optimize(s.condition)
    s.action = optimize(s.action)
    s.body = optimize(s.body)
    if (s.condition == false) {
      return []
    }
    return s
  },
  
  BinaryExpression(e) {
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.op === "furthermore") {
      if (e.left === true) return e.right
      else if (e.right === true) return e.left
    } else if (e.op === "alternatively") {
      if (e.left === false) return e.right
      else if (e.right === false) return e.left
    } else if ([Number, BigInt].includes(e.left.constructor)) {
      if ([Number, BigInt].includes(e.right.constructor)) {
        if (e.op === "with") return e.left + e.right
        else if (e.op === "without") return e.left - e.right
        else if (e.op === "accumulate") return e.left * e.right
        else if (e.op === "sunder") return e.left / e.right
        else if (e.op === "exponentiate") return e.left ** e.right
        else if (e.op === "residue") return e.left % e.right
        else if (e.op === "lesser") return e.left < e.right
        else if (e.op === "tis lesser") return e.left <= e.right
        else if (e.op === "tis") return e.left === e.right
        else if (e.op === "tis not") return e.left !== e.right
        else if (e.op === "tis greater") return e.left >= e.right
        else if (e.op === "greater") return e.left > e.right
      } else if (e.left === 0 && e.op === "with") return e.right
      else if (e.left === 1 && e.op === "accumulate") return e.right
      else if (e.left === 0 && e.op === "without") return new ast.UnaryExpression("-", e.right)
      else if (e.left === 1 && e.op === "exponentiate") return 1
      else if (e.left === 0 && ["accumulate", "sunder"].includes(e.op)) return 0
    } else if (e.right.constructor === Number) {
      if (["with", "without"].includes(e.op) && e.right === 0) return e.left
      else if (["accumulate", "sunder"].includes(e.op) && e.right === 1) return e.left
      else if (e.op === "accumulate" && e.right === 0) return 0
      else if (e.op === "exponentiate" && e.right === 0) return 1
    }
    return e
  },
  UnaryExpression(e) {
    e.value = optimize(e.value)
    if (e.value.constructor === Number) {
      if (e.sign === "-") {
        return -e.value
      }
    }
    return e
  },
  ArrayLookup(e) {
    e.array = optimize(e.array)
    e.index = optimize(e.index)
    return e
  },
  Liste(e) {
    e.values = optimize(e.values)
    return e
  },
  Call(c) {
    c.varname = optimize(c.varname)
    c.args = optimize(c.args)
    return c
  },
  BigInt(e) {
    return e
  },
  Number(e) {
    return e
  },
  Numeral(e) {
    return e
  },
  Tobeornottobe(b) {
    return b
  },
  Boolean(e) {
    return e
  },
  Print(e) {
    return e
  },
  String(e) {
    return e
  },
  Array(a) {
    return a.flatMap(optimize)
  },
}
