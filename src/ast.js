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

import util from "util";

export class Program {
  constructor(works, statements) {
    this.works = works;
    this.statements = statements;
  }
  [util.inspect.custom]() {
    return prettied(this);
  }
}

export class Composition {
  constructor(id, compBody) {
    Object.assign(this, { id, compBody });
  }
}

export class Corollary {
  constructor(type, id, params, body) {
    Object.assign(this, { type, id, params, body });
  }
}
export class Param {
  constructor(type, varname) {
    Object.assign(this, { type, varname });
  }
}

export class IfStatement {
  constructor(_if, exp1, bd1, _elif, exp2, bd2, _else, exp3, bd3) {
    Object.assign(this, {_if, exp1, bd1, _elif, exp2, bd2, _else, exp3, bd3})
  }
}

export class SwitchStatement {
  constuctor(swtch, factor1, cse, factor2, body, brk) {
    Object.assign(this, {swtch, factor1, cse, factor2, body, brk})
  }
}

export class ForLoop {
  constructor(_for, s1, s2, s3, body, brk) {
    Object.assign(this, {_for, s1, s2, s3, body, brk})
  }
}

export class ForIn {
  constructor(_for, var1, _in, var2, body, brk) {
    Object.assign(this, {_for, var1, _in, var2, body, brk})
  }
}

export class DoWhile {
  constructor(doo, body, brk, whle, logExp) {
    Object.assign(this, {doo, body, brk, whle, logExp})
  }
}

// Statement ------------------------------------------
export class VariableInitialization {
  constructor(type, name, initializer) {
    Object.assign(this, { type, name, initializer });
  }
}

export class VariableAssignment {
  constructor(name, value) {
    Object.assign(this, {name, value})
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

export class IncDecby {
  constructor(name, op, expression) {
    Object.assign(this, {name, op, expression})
  }
}

export class IncDec {
  constructor(name, op) {
    Object.assign(this, {name, op})
  }
}
// End Statement -------------------------------


export class Factor {
  constructor(sign, factor) {
    Object.assign(this, { sign, factor });
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

export class MultDiv {
  constructor(multdiv, op, expo) {
    Object.assign(this, { multdiv, op, expo });
  }
}

export class Expo {
  constructor(factor, op, expo) {
    Object.assign(this, { factor, op, expo });
  }
}

export class AddSub {
  constructor(addsub) {
    this.addsub = addsub;
  }
}

export class IdentifierExpression {
  constructor(name) {
    this.name = name;
  }
}

export class Type {
  constructor(name) {
    this.name = name;
  }
}

// Source:
function prettied(node) {
  // Return a compact and pretty string representation of the node graph,
  // taking care of cycles. Written here from scratch because the built-in
  // inspect function, while nice, isn't nice enough.
  const tags = new Map();

  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return;
    tags.set(node, tags.size + 1);
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child);
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`;
      if (Array.isArray(e)) return `[${e.map(view)}]`;
      return util.inspect(e);
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let [type, props] = [node.constructor.name, ""];
      Object.entries(node).forEach(([k, v]) => (props += ` ${k}=${view(v)}`));
      yield `${String(id).padStart(4, " ")} | ${type}${props}`;
    }
  }

  tag(node);
  return [...lines()].join("\n");
}
