export type Resource = {
  prefix?: string;
  values?: Record<string, string> | ((value: string) => string | undefined);
  bg: string;
  border: string;
};

export default class Label {
  constructor(private resources: Record<string, Resource>) {}

  get(name: string, value: string | undefined) {
    const r = this.resources[name];
    if (!r) {
      return { label: "undefined", bg: "#fecaca", border: "#f87171" };
    }

    let label = r.prefix ?? "";

    if (r.values && value) {
      let vLabel;
      if (typeof r.values === "function") {
        vLabel = r.values(value);
      } else {
        vLabel = r.values[value];
      }

      label += vLabel ?? value;
    }

    const { bg, border } = r;

    return { label, bg, border };
  }
}
