export default {
  h: {
    prefix: "高さ",
    values: valuesOrFn(
      {
        auto: "自動",
        full: "100%",
      },
      convertToPx
    ),
    bg: "#e2e8f0",
    border: "#94a3b8",
  },
  w: {
    prefix: "幅",
    values: valuesOrFn(
      {
        auto: "自動",
        full: "100%",
      },
      convertToPx
    ),
    bg: "#e2e8f0",
    border: "#94a3b8",
  },
  px: {
    prefix: "左右余白(内)",
    values: convertToPx,
    bg: "#e9d5ff",
    border: "#c084fc",
  },
  py: {
    prefix: "上下余白(内)",
    values: convertToPx,
    bg: "#e9d5ff",
    border: "#c084fc",
  },
  flex: {
    prefix: "フレックス",
    bg: "#e2e8f0",
    border: "#94a3b8",
  },
  items: {
    values: {
      start: "上揃え",
      center: "上下中央",
      end: "下揃え",
    },
    bg: "#e2e8f0",
    border: "#94a3b8",
  },
  justify: {
    values: {
      start: "右揃え",
      center: "左右中央",
      end: "左揃え",
    },
    bg: "#e2e8f0",
    border: "#94a3b8",
  },
  rounded: {
    prefix: "角丸",
    bg: "#e2e8f0",
    border: "#94a3b8",
  },
  bg: {
    values: (value: string) => {
      // TODO: 色以外の値

      if (value.startsWith("[")) {
        return;
      }

      return `背景色-${color(value)}`;
    },
    bg: "#e5e5e5",
    border: "#a3a3a3",
  },
  text: {
    values: (value: string) => {
      // TODO: 色以外の値

      if (value.startsWith("[")) {
        return;
      }

      return `文字色-${color(value)}`;
    },
    bg: "#e5e5e5",
    border: "#a3a3a3",
  },
};

const colors: Record<string, string> = {
  sky: "空色",
  white: "白",
};

const shades: Record<string, string> = {
  500: "",
  800: "濃い",
};

function color(value: string) {
  const [color, shade] = value.split("-");

  return `${shades[shade] ?? ""}${colors[color] ?? ""}`;
}

function valuesOrFn(
  values: Record<string, string>,
  fn: (value: string) => string | undefined
) {
  return (value: string) => {
    return values[value] ?? fn(value);
  };
}

function convertToPx(value: string) {
  if (value.match(/^\d+$/)) {
    return `${Number(value) * 4}px`;
  }
}
