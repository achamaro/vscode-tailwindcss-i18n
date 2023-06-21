import { throttle } from "throttle-debounce";
import {
  DecorationOptions,
  DecorationRangeBehavior,
  ExtensionContext,
  Range,
  window,
  workspace,
} from "vscode";

import Label from "./label";
import ja from "./lang/ja";
import { Cls, parse } from "./parser";
import { patterns } from "./patterns";

export function activate(context: ExtensionContext) {
  // The decoration type for hiding the icon name text.
  // https://github.com/lokalise/i18n-ally/blob/43df97db80073230e528b7bf63610c903d886df8/src/editor/annotation.ts#L13-L15
  const decorationType = window.createTextEditorDecorationType({
    textDecoration: `none; display: none;`,
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  });

  const label = new Label(ja);

  const updateDecorations = throttle(300, async () => {
    const editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    const { document, selection } = editor;

    const classes = await parse(document.fileName, document.getText());

    const decorations: DecorationOptions[] = classes.flatMap((cls) => {
      return matchPatterns(cls, label)
        .map(({ label, range }) => {
          return {
            range: new Range(
              document.positionAt(range.start),
              document.positionAt(range.end)
            ),
            renderOptions: {
              before: {
                contentText: label,
              },
            },
          };
        })
        .filter(({ range }) => !range.contains(selection));
    });

    editor.setDecorations(decorationType, decorations);
  });

  updateDecorations();

  window.onDidChangeActiveTextEditor(
    updateDecorations,
    null,
    context.subscriptions
  );
  window.onDidChangeTextEditorSelection(
    updateDecorations,
    null,
    context.subscriptions
  );
  workspace.onDidChangeTextDocument(
    ({ document }) => {
      if (document === window.activeTextEditor?.document) {
        updateDecorations();
      }
    },
    null,
    context.subscriptions
  );
}

export function deactivate() {}

function matchPatterns(cls: Cls, label: Label) {
  return Object.entries(patterns).flatMap(([name, match]) => {
    return match(cls).map(({ match, range }) => {
      return {
        name,
        range,
        ...label.get(name, match[1]),
      };
    });
  });
}
