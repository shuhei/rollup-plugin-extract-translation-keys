import React from "react";

export default function Foo(props) {
  return (
    <span className="foo">
      {__("foo.bar")}
      {props.children}
    </span>
  );
}
