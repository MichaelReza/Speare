import {
  Variable,
  VariableAssignment,
  Type,
  Param,
  CorollaryType,
  Corollary,
  ListeType,
  Liste,
  Tobeornottobe,
  ConcordanceType,
  Concordance,
  Numeral,
  UnaryExpression,
} from "./ast.js"
import * as stdlib from "./stdlib.js"

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

const check = (self) => ({
  isNumeral() {
    var t = typeof self.value !== "undefined" && typeof self.value.type !== "undefined" ? self.value.type : self.type
    must(
      [Type.NUMERAL].includes(t),
      `Expected a number, found ${t.name}`
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
  isBooleanOrNumeric() {
    must(
      ([Type.BOOLEAN, Type.NUMERAL].includes(self.type)),
      `Expected a boolean or numeral, found ${self.type.name}`
    )
  },
  isAType() {
    must([Type, Corollary].includes(self.constructor), "Type expected")
  },
  isAConcordance() {
    must(self.type.constructor === ConcordanceType, "Concordance expected")
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
  isAListe() {
    must(self.type.constructor === ListeType, "Liste expected")
  },
  hasSameTypeAs(other) {
    must((self.type.name ?? self.type) === (other.type.name ?? other.type), "Operands do not have the same type")
  },
  isSameTypeAs(other) {
    must((self.name ?? self) === (other.name ?? other), "Variable initialized is not the same as declared type")
  },
  allHaveSameType() {
    must(
      self.slice(1).every(e => e.type.name === self[0].type.name),
      "Not all elements have the same type"
    )
  },
  isAssignableTo(t) {
    must(
      ((self.type.name ?? self.type) === (t.type.name ?? t.type ?? t.name ?? t)),
      `Cannot assign a ${(self.type.name ?? self.type)} to a ${(t.type.name ?? t.type ?? t.name ?? t)}`
    )
  },
  isNotReadOnly() {
    must(!self.readOnly, `Cannot assign to constant ${self.name}`)
  },
  areAllDistinct() {
    must(
      new Set(self.map((f) => f.name)).size === self.length,
      "Fields must be distinct"
    )
  },
  isInTheDict(object) {
    let incflag = false
    object.dictEntries.forEach(function f(entry) {
      if (entry.key.value === self.value) {
        incflag = true
        return
      }
    })
    must(incflag, "No such field")
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
      self.type === (Type.VOID.name ?? Type.VOID),
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
  match(targetTypes) {
    // self is the array of arguments
    must(
      targetTypes.length === self.length,
      `${targetTypes.length} argument(s) required but ${self.length} passed`
    )
    targetTypes.forEach((type, i) => check(self[i]).isAssignableTo(type))
  },
  matchParametersOf(func) {
    must(
      self.length === func.params.length,
      `${func.params.length} argument(s) required but ${self.length} passed`
    )
    func.params.forEach((param, i) => {
      must((self[i].type.name ?? self[i].name ?? self[i].type) === (param.type ?? param),
      `Cannot assign a ${self[i].type.name ?? self[i].name ?? self[i].type} to ${param.type ?? param} ${param.name}`)
    })
  },
  matchFieldsOf(corollaryType) {
    check(self).match(structType.fields.map((f) => f.type))
  },
})

class Context {
  constructor(parent = null, configuration = {}) {
    // Parent (enclosing scope) for static scope analysis
    this.parent = parent
    // All local declarations. Names map to variable declarations, types, and
    // function declarations
    this.locals = new Map()
    // Whether we are in a loop, so that we know whether breaks and continues
    // are legal here
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false
    // Whether we are in a function, so that we know whether a return
    // statement can appear here, and if so, how we typecheck it
    this.function = configuration.forFunction ?? parent?.function ?? null
  }
  sees(name) {
    // Search "outward" through enclosing scopes
    return this.locals.has(name) || this.parent?.sees(name)
  }
  add(name, entity) {
    // No shadowing! Prevent addition if id anywhere in scope chain!
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
    // Create new (nested) context, which is just like the current context
    // except that certain fields can be overridden
    return new Context(this, configuration)
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  Program(p) {
    p.statements = this.analyze(p.statements)
    return p
  }
  ArrayType(t) {
    t.baseType = this.analyze(t.baseType)
    return t
  }
  FunctionType(t) {
    if (t.parameterTypes != undefined) {
      t.parameterTypes = this.analyze(t.parameterTypes)
    }
    t.returnType = this.analyze(t.returnType)
    return t
  }
  OptionalType(t) {
    t.baseType = this.analyze(t.baseType)
    return t
  }
  VariableInitialization(d) {
    // Declarations generate brand new variable objects
    d.initializer = this.analyze(d.initializer)
    check(d.type).isSameTypeAs(d.initializer.type)
    
    this.add(d.name, d.initializer)
    return d
  }
  // Assignment(s) {
  //   s.source = this.analyze(s.source)
  //   s.target = this.analyze(s.target)
  //   check(s.source).isAssignableTo(s.target.type)
  //   check(s.target).isNotReadOnly()
  //   return s
  // }
  VariableAssignment(v) {
    v.value = this.analyze(v.value)
    check(v.value).isAssignableTo(this.lookup(v.name.name))
    return v
  }
  Param(p) {
    this.add(p.name, p)
    return p
  }
  IncDec(s) {
    // Make sure s.name does not refer to readonly variable
    // make sure s.name refers to a integer...
    check(this.lookup(s.name)).isNumeral()
    return s
  }
  IncDecby(s) {
    s.expression = this.analyze(s.expression)
    check(this.lookup(s.name)).isNumeral()
    //check your expression type, should be integer
    //check s.name, make sure it is integer and not readonly
    return s
  }
  UnaryAssignment(s) {
    return this.lookup(s.value)
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
  ShortReturnStatement(s) {
    check(this).isInsideAFunction()
    check(this.function).returnsNothing()
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
    if (s.le3) {
      s.body3 = this.analyze(s.body3)
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
  RepeatStatement(s) {
    s.count = this.analyze(s.count)
    check(s.count).isInteger()
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
  OrExpression(e) {
    e.disjuncts = this.analyze(e.disjuncts)
    e.disjuncts.forEach((disjunct) => check(disjunct).isBoolean())
    e.type = Type.BOOLEAN
    return e
  }
  AndExpression(e) {
    e.conjuncts = this.analyze(e.conjuncts)
    e.conjuncts.forEach((conjunct) => check(conjunct).isBoolean())
    e.type = Type.BOOLEAN
    return e
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left)
    e.right = this.analyze(e.right)
    if (["furthermore", "alternatively"].includes(e.op)) {
      //check(e.left).isInteger()
      //check(e.right).isInteger()
      //e.type = Type.INT
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
    } else {}
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
    a.keyType = a.dictEntries[0].key.type
    a.valType = a.dictEntries[0].val.type
    a.type = new ConcordanceType(
      (a.keyType),
      (a.valType)
    )
    
    return a
  }
  DictEntry(a) {
    a.key = this.analyze(a.key)
    a.val = this.analyze(a.val)
    return a
  }
  EmptyArray(e) {
    e.baseType = this.analyze(e.baseType)
    e.type = new ListeType(e.baseType)
    return e
  }
  Call(c) {
    c.setParent = this.lookup(c.varname)
    c.setType = this.lookup(c.varname).type
    c.args = this.analyze(c.args)
    check(c.parent).isCallable()
    check(c.args).matchParametersOf(c.parent)
    return c
  }
  IdentifierExpression(e) {
    // Id expressions get "replaced" with the variables they refer to
    e.value = this.lookup(e.name)
    e.type = e.value.type
    return e
  }
  TypeId(t) {
    t = this.lookup(t.name)
    check(t).isAType()
    return t
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
    f.params = f.params.map(p => (childContext.analyze(p)))
    this.add(f.id, f)
    f.body = childContext.analyze(f.body)
    return f
  }
  DictLookup(e) {
    e.dict = this.analyze(e.dict).value
    console.log(e.dict)
    check(e.key).isInTheDict(e.dict)
    e.dict.dictEntries.forEach(function f(entry) {
      if (e.key.value === entry.key.value) {
        e.value = entry.val
      }
    })
    return e.value
  }
}

export default function analyze(node) {
  // Allow primitives to be automatically typed
  // BigInt.prototype.type = Type.Numeral;
  // Number.prototype.type = Type.BOOLEAN;
  // String.prototype.type = Type.STRING;
  // Type.prototype.type = Type.TYPE;
  const initialContext = new Context()

  // Add in all the predefined identifiers from the stdlib module
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions }
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type)
  }
  return initialContext.analyze(node)
}
