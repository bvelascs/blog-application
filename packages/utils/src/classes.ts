export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy
  
  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  return classes
    .flatMap((c) => {
      if (typeof c === "string") {
        return c;
      }
      if (c && typeof c === "object") {
        return Object.keys(c).filter((key) => c[key]);
      }
      return [];
    })
    .join(" ");
}

export default cx;
