import React from "react";
import Foo from "./foo";

export default class Example extends React.Component {
  render() {
    return React.createElement(
      "div",
      {},
      React.createElement(Foo, {}, __("some.example"))
    );
  }
}
