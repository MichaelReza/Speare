// Code Generator Speare -> JavaScript
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

export default function generate(program) {
  const output = []

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
        "alternatively" : "||",
        "furthermore" : "&&",
        "incrementby" : "+=",
        "decrementby" : "-=",
        "increment" : "++",
        "decrement" : "--"
      }

  const gen = node =>  {
    return generators[node.constructor.name](node)
  }

  const generators = {
    Program(p) {
      gen(p.statements)
    },
    Corollary(f) {
      output.push(`function ${f.id}(${gen(f.params).join(", ")}) {`)
      gen(f.body)
      output.push(`}`)
    },
    Param(p) {
      return p.name
    },
    IfStatement(s) {
      output.push(`if (${gen(s.le1)}) {`)
      gen(s.body)
      if (s.le2[0] !== undefined) {
        s.le2.forEach((element, index) => {
          output.push(`} else if (${gen(element)}) {`)
          gen(s.body2[index])
        })
      } 
      if (s.body3[0] !== undefined) {
        output.push(`} else {`)
        gen(s.body3)
      }
      output.push(`}`)
    },
    ForLoop(f) {
      output.push(`for (${gen(f.init)}; ${gen(f.condition)}; ${gen(f.action)}) {`)
      gen(f.body)
      output.push("}")
    },
    WhileLoop(w) {
      output.push(`while (${gen(w.logicExp)}) {`)
      gen(w.body)
      output.push("}")
    },
    VariableInitialization(v) {
      output.push(`let ${v.name} = ${gen(v.initializer)}`)
    },
    ForLoopVariable(v) {
      return `let ${v.name} = ${gen(v.initializer)}`
    },
    VariableAssignment(v) {
      output.push(`${v.name.name} = ${gen(v.value)}`)
    },
    Print(e) {
      output.push(`console.log(${gen(e.expression)})`)
    },
    Return(e) {
      output.push(`return ${gen(e.expression)}`)
    },
    Break(b) {
      output.push("break")
    },
    IncDecby(i) {
      output.push(`${i.name} ${OPERATORS[i.op]} ${gen(i.expression)}`)
    },
    IncDec(i) {
        output.push(`${i.name}${OPERATORS[i.op]}`)
    },
    ForLoopAction(i) {
      return `${i.name}${OPERATORS[i.op]}`
    },
    BinaryExpression(b) {
      return `(${gen(b.left)} ${OPERATORS[b.op]} ${gen(b.right)})`
    },
    UnaryExpression(u) {
      if (u.sign === "nay") {
        return (`!(${gen(u.value)})`)
      } else if (u.sign === "absolutization") {
        return (`Math.abs(${gen(u.value)})`)
      } else if (u.sign === "quadrangle") {
        return (`Math.sqrt(${gen(u.value)})`)
      } else if (u.sign === "-") {
        return (`-${gen(u.value)}`)
      }
    },
    IdentifierExpression(n) {
      return n.name
    },
    StringValue(s) {
      return JSON.stringify(s.value)
    },
    Liste(a) {
      return `[${a.values.map(gen).join(", ")}]`
    },
    Array(a) {
      return a.map(gen)
    },
    ArrayLookup(a) {
      return `${gen(a.array)}[${gen(a.index)}]`
    },
    DictLookup(d) {
      return `${gen(d.dict)}[${gen(d.key)}]`
    },
    Call(c) {
      return`${c.varname}(${gen(c.args).join(", ")})`
    },
    StatementCall(c) {
      output.push(`${c.varname}(${gen(c.args).join(", ")})`)
    },
    Numeral(n) {
      return n.value
    },
    Tobeornottobe(t) {
      return t.value === `fallacious` ? "false" : "true"
    },
    Concordance(c) {
      return `{${gen(c.dictEntries).join(", ")}}`
    },
    DictEntry(d) {
      return `${gen(d.key)} : ${gen(d.val)}`
    },
  }

  gen(program)
  return output.join("\n")
}