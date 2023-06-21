/* eslint-disable @typescript-eslint/naming-convention */
import {
  Expression,
  JSXAttribute,
  ModuleItem,
  parse as swcParse,
  ParseOptions,
  Span,
  TemplateElement,
  VariableDeclarator,
} from "@swc/core";

export type Cls = {
  span: Span;
  value: string;
};

export async function parse(filename: string, text: string) {
  let parseOptions: ParseOptions;
  if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
    parseOptions = {
      syntax: "typescript",
      tsx: filename.endsWith(".tsx"),
      comments: false,
    };
  } else {
    parseOptions = {
      syntax: "ecmascript",
      target: "esnext",
      jsx: filename.endsWith(".jsx"),
      comments: false,
    };
  }

  const { body } = await swcParse(text, parseOptions);

  const classes: Cls[] = [];

  walk(body, (item, [parent, grandparent]) => {
    if (item.type === "StringLiteral") {
      // 親の階層がただのオブジェクトの場合は更に親をたどる
      const p = parent?.type ? parent : grandparent;
      if (p?.type === "JSXAttribute") {
        if (p.name.type === "Identifier" && p.name.value === "className") {
          classes.push({
            span: item.span,
            value: item.value,
          });
        }
      } else if (
        p?.type === "VariableDeclarator" ||
        p?.type === "TemplateElement" ||
        p?.type === "CallExpression" ||
        p?.type === "BinaryExpression"
      ) {
        classes.push({
          span: item.span,
          value: item.value,
        });
      }
      return;
    }

    if (item.type === "TemplateElement") {
      if (typeof item.raw === "string") {
        classes.push({
          span: item.span,
          value: item.raw,
        });
      }
      return;
    }
  });

  return classes;
}

type Item =
  | ModuleItem
  | VariableDeclarator
  | Expression
  | TemplateElement
  | JSXAttribute;

function walk(
  items: ModuleItem[],
  fn: (item: Item, parents: Item[]) => void,
  parents: Item[] = []
) {
  for (const item of items) {
    if (item.type) {
      fn(item, parents);
    }

    if (typeof item === "object") {
      Object.values(item).forEach((value) => {
        const items = [].concat(value).filter((value: any) => {
          return value && typeof value === "object";
        });
        if (items.length) {
          walk(items, fn, [item, ...parents]);
        }
      });
    }
  }
}
