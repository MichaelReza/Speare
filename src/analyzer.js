import {
  Type,
  Corollary,
  ListeType,
  Concordance,
} from "./ast.js"
import * as stdlib from "./stdlib.js"

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

const check = (self) => ({

  isNumeral() {
    must(
      self.type == "Numeral" || self.type.name == "Numeral",
      `Expected a number, found ${self.type.name ?? self.type}`
    )
  },
  isNumericOrString() {
    must(
      self.type === "Numeral" || self.type === "Lexicographical" || [Type.NUMERAL, Type.STRING].includes(self.type),
      `Expected a number or string, found ${self.type.name}`
    )
  },
  isBoolean() {
    must(
      ([Type.BOOLEAN].includes(self.type)),
      `Expected a boolean, found ${self.type.name}`
    )
  },
  hasUniqueKeys() {
    var keySet = []
    var uniqueBool = true
    self.dictEntries.forEach(function unique(entry) {
      if (keySet.includes(entry.key.value)) {
        uniqueBool = false;
        return;
      }
      keySet.push(entry.key.value)
    })
    must(uniqueBool, "Keys must be distinct")
  },
  hasSameTypeAs(other) {
    must((self.type.name ?? self.type) === (other.type.name ?? other.type), "Operands do not have the same type")
  },
  isSameTypeAs(other) {
    must(other === undefined || (self.name ?? self) === (other.name ?? other), "Variable initialized is not the same as declared type")
  },
  correctReassignment(other) {
    must(
      (self.type) === (other.type), `Variable reassignment statement has incompatible types`)
  },
  allHaveSameType() {
    must(
      self.slice(1).every(e => e.type.name === self[0].type.name),
      "Not all elements have the same type"
    )
  },
  isInsideALoop() {
    must(self.inLoop, "Exit can only appear in a loop")
  },
  isInsideAFunction(context) {
    must(self.function, "Returneth can only appear in a function")
  },
  isCallable() {
    must(
      self.constructor === Concordance ||
      self.constructor == Corollary,
      "Call of non-function or non-constructor"
    )
  },
  returnsNothing() {
    must(
      self.type === Type.VOID,
      "Something should be returned here"
    )
  },
  returnsSomething() {
    must(self.type.returnType !== Type.VOID, "Cannot return a value here")
  },
  isReturnableFrom(f) {
    must(
      ((self.type.name ?? self.type) === (f.type.name ?? f.type)),
      `Expected return of type ${(f.type.name ?? f.type)} and instead got return type ${(self.type.name ?? self.type)}.`
    )
  },
  matchParametersOf(func) {
    must(
      self.length === func.params.length,
      `${func.params.length} argument(s) required but ${self.length} passed`
    )
    func.params.forEach((param, i) => {
      must((self[i].type.name ?? self[i].name ?? self[i].type) === (param.type),
      `Cannot assign a ${self[i].type.name ?? self[i].name ?? self[i].type} to ${param.type} ${param.name}`)
    })
  },
})

class Context {
  constructor(parent = null, configuration = {}) {
    this.parent = parent
    this.locals = new Map()
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false
    this.function = configuration.forFunction ?? parent?.function ?? null
    this.class = configuration.forClass ?? false
  }
  sees(name) {
    return this.locals.has(name) || this.parent?.sees(name)
  }
  add(name, entity) {
    if (this.sees(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.locals.set(name, entity)
  }
  lookup(name) {
    const entity = this.locals.get(name)
    if (entity) {
      return entity
    } else if (this.parent) {
      return this.parent.lookup(name)
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  newChild(configuration = {}) {
    return new Context(this, configuration)
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  Program(p) {
    p.statements = this.analyze(p.statements)
    return p
  }
  VariableInitialization(d) {
    d.initializer = this.analyze(d.initializer)
    check(d.type).isSameTypeAs(d.initializer.type)
    this.add(d.name, d.initializer)
    return d
  }
  VariableAssignment(v) {
    v.value = this.analyze(v.value)
    check(v.value).correctReassignment(this.lookup(v.name.name))
    return v
  }
  Param(p) {
    this.add(p.name, p)
    return p
  }
  IncDec(s) {
    check(this.lookup(s.name)).isNumeral()
    return s
  }
  IncDecby(s) {
    s.expression = this.analyze(s.expression)
    check(this.lookup(s.name)).isNumeral()
    return s
  }
  Break(s) {
    check(this).isInsideALoop()
    return s
  }
  Print(s) {
    s.expression = this.analyze(s.expression)
    return s
  }
  Return(s) {
    s.expression = this.analyze(s.expression)
    check(this).isInsideAFunction()
    if (s.expression.length == 0) {
      check(this.function).returnsNothing()
    } else {
      check(this.function).returnsSomething()
      check(s.expression[0]).isReturnableFrom(this.function)
    }
    return s
  }
  IfStatement(s) {
    s.le1 = this.analyze(s.le1)
    check(s.le1).isBoolean()
    if (s.le2) {
      s.le2 = this.newChild().analyze(s.le2)
      s.le2.forEach(function loopElifs(elif) {
          check(elif).isBoolean()
        })
    }
    return s
  }
  WhileLoop(s) {
    s.logicExp = this.analyze(s.logicExp)
    s.logicExp.forEach(function checkBoolean(exp) {
      check(exp).isBoolean()
    })
    s.body = this.newChild({ inLoop: true }).analyze(s.body)
    return s
  }
  ForLoop(s) {
    s.init = this.analyze(s.init)
    s.condition = this.analyze(s.condition)
    if (s.action) {
      s.action = this.analyze(s.action)
    }
    s.body = this.newChild({ inLoop: true }).analyze(s.body)
    return s
  }
  ForLoopVariable(v) {
    v.initializer = this.analyze(v.initializer)
    check(v.type).isSameTypeAs(v.initializer.type)
    this.add(v.name, v.initializer)
    return v
  }
  ForLoopAction(v) {
    check(this.lookup(v.name)).isNumeral()
    return v
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left)
    e.right = this.analyze(e.right)
    if (["furthermore", "alternatively"].includes(e.op)) {
      check(e.left).hasSameTypeAs(e.right)
      e.type = Type.BOOLEAN
    } else if (["with"].includes(e.op)) {
      check(e.left).isNumericOrString()
      check(e.left).hasSameTypeAs(e.right)
      e.type = e.left.type
    } else if (
      ["without", "accumulate", "sunder", "residue", "exponentiate"].includes(
        e.op
      )
    ) {
      check(e.left).isNumeral()
      check(e.left).hasSameTypeAs(e.right)
      e.type = e.left.type
    } else if (
      ["lesser", "tis lesser", "nobler", "tis nobler"].includes(e.op)
    ) {
      check(e.left).isNumericOrString()
      check(e.left).hasSameTypeAs(e.right)
      e.type = Type.BOOLEAN
    } else if (["tis", "tis not"].includes(e.op)) {
      check(e.left).hasSameTypeAs(e.right)
      e.type = Type.BOOLEAN
    }
    return e
  }
  UnaryExpression(e) {
    e.value = this.analyze(e.value)
    e.type = e.value.type
    if (e.sign === "nay") {
      check(e.value).isBoolean()
    } else if (e.sign === "absolutization" || e.sign === "quadrangle" || e.sign === "-") {
      check(e.value).isNumeral()
    }
    return e
  }
  Liste(a) {
    a.values = this.analyze(a.values)
    check(a.values).allHaveSameType()
    a.type = new ListeType(a.values[0].type)
    return a
  }
  Concordance(a) {
    check(a).hasUniqueKeys()
    a.dictEntries.forEach(x => x = this.analyze(x))
    if (a.dictEntries.length > 0) {
      a.keyType = a.dictEntries[0].key.type
      a.valType = a.dictEntries[0].val.type
      let keyTypeName = (a.keyType.name)
      let valTypeName = (typeof a.valType.name !== "undefined" ? a.valType.name : a.valType)
      a.type = "[" + keyTypeName + ":" + valTypeName + "]"
    }
    return a
  }
  DictEntry(a) {
    if (a !== undefined) {
      a.key = this.analyze(a.key)
      a.val = this.analyze(a.val)
    }
    return a
  }
  Call(c) {
    c.setParent = this.lookup(c.varname)
    c.setType = this.lookup(c.varname).type
    c.args = this.analyze(c.args)
    check(c.parent).isCallable()
    check(c.args).matchParametersOf(c.parent)
    return c
  }
  StatementCall(c) {
    c.setParent = this.lookup(c.varname)
    c.setType = this.lookup(c.varname).type
    c.args = this.analyze(c.args)
    check(c.parent).isCallable()
    check(c.args).matchParametersOf(c.parent)
    return c
  }
  IdentifierExpression(e) {
    e.type = this.lookup(e.name).type
    return e
  }
  Numeral(e) {
    e.type = Type.NUMERAL
    return e
  }
  Tobeornottobe(e) {
    e.type = Type.BOOLEAN
    return e
  }
  StringValue(e) {
    e.type = Type.STRING
    return e
  }
  Array(a) {
    return a.map((item) => this.analyze(item))
  }
  ArrayLookup(e) {
    e.array = this.analyze(e.array)
    e.type = e.array.type.baseType
    e.index = this.analyze(e.index)
    e.index.forEach(function checkNumeral(exp) {
      check(exp).isNumeral()
    })
    return e
  }

  Corollary(f) {
    const childContext = this.newChild({ inLoop: false, forFunction: f })
    f.params = childContext.analyze(f.params)
    this.add(f.id, f)
    f.body = childContext.analyze(f.body)
    return f
  }

  Composition(c) {
    throw new Error("Compositions cannot be analyzed")
  }
  
  DictLookup(e) {
    e.dict = this.analyze(e.dict)
    e.type = e.dict.type.includes(":") ? e.dict.type.split(":")[1].split("]")[0] : e.dict.type
    return e
  }
}

export default function analyze(node) {
  const initialContext = new Context()
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions }
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type)
  }
  return initialContext.analyze(node)
}