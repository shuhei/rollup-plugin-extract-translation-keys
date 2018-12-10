import React from "react";
import Foo from "./foo";

export default class Example extends React.Component {
  render() {
    const word = __("some.word");
    return React.createElement(
      "div",
      {},
      React.createElement(Foo, {}, __("some.example")),
      __("some.interpolation", word, "no")
    );
  }
}
