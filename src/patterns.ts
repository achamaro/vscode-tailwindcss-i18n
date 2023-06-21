import { Cls } from "./parser";

export const patterns = {
  h: createPattern("h"),
  w: createPattern("w"),
  px: createPattern("px"),
  py: createPattern("py"),
  flex: createPattern("flex", false),
  items: createPattern("items"),
  justify: createPattern("justify"),
  bg: createPattern("bg"),
  text: createPattern("text"),
  font: createPattern("font"),
  rounded: createPattern("rounded", false), // FIXME: 値がある場合
};

function createPattern(name: string, hsaValues: boolean = true) {
  let pattern = `(?<=^|\\s)${name}`;
  if (hsaValues) {
    pattern += "-([^\\s]+)";
  }
  const reg = new RegExp(pattern, "g");
  return (cls: Cls) => {
    return [...cls.value.matchAll(reg)].map((match) => {
      return {
        match,
        range: {
          start: cls.span.start + match.index!,
          end: cls.span.start + match.index! + match[0].length,
        },
      };
    });
  };
}
