import React from "react";

export default function Foo(props) {
  return React.createElement(
    "span",
    { className: "foo" },
    __("foo.bar"),
    props.children
  );
}
