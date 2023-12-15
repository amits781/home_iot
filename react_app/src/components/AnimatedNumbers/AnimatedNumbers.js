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
          {"mass":1,"tension":30,"friction":10},
          {"mass":2,"tension":40,"friction":10},
          {"mass":3,"tension":30,"friction":10},
        ]}
      ></AnimatedNumbers>
    </span>
  );
}

export default AnimatedNumbersCustom;