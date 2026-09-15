import React from "react";
import AnimatedNumbers from "react-animated-numbers";
import "./AnimatedNumbers.css";

function AnimatedNumbersCustom({ num }) {
  return (
    <span>
      <AnimatedNumbers
        includeComma
        animateToNumber={num}
        locale="en-IN"
        configs={[
          {"mass":1,"tension":220,"friction":30},
          {"mass":1,"tension":220,"friction":30},
          {"mass":1,"tension":220,"friction":30},
        ]}
      ></AnimatedNumbers>
    </span>
  );
}

export default AnimatedNumbersCustom;