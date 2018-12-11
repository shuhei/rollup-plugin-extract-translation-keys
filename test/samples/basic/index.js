import React from "react";
import Foo from "./foo";

export default class Example extends React.Component {
  render() {
    const word = __("some.word");
    return (
      <div>
        <Foo>{__("some.example")}</Foo>
        {__("some.interpolation", word, "no")}
      </div>
    );
  }
}
