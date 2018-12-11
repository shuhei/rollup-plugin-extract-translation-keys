const foo = "hello" + __TR__("foo.bar");

export function hello() {
  const bar = `${foo} foo ${__TR__("bar.baz")} bar`;
}
