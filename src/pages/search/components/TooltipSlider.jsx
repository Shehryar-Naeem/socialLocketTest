import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
function TooltipSlider({ onChange, min, max }) {
  const [range, setRange] = useState([min, max]);

  return (
    <div className="d-flex align-items-center">
      <p
        style={{
          fontSize: 12,
          marginRight: 10,
          marginBottom: 0,
        }}
      >
        {range[0]}
      </p>
      <Slider
        range
        allowCross={false}
        onChange={(v) => {
          setRange(v);
          onChange && onChange(v);
        }}
        max={max}
        value={range}
        min={min}
      />
      <p
        style={{
          fontSize: 12,
          marginLeft: 10,
          marginBottom: 0,
        }}
      >
        {range[1]}
      </p>
    </div>
  );
}

export default TooltipSlider;
