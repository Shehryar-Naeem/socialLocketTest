import { useState } from "react";

const Tabs = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleTabClick(index) {
    setActiveIndex(index);
  }

  return (
    <div className="user-bio common-tab">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        {props.tabs.map((tab, index) => (
          <li key={tab.title}>
            <button
              // className="nav-link active"
              className={`nav-link ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleTabClick(index)}
              id="nav-bio-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-bio"
              type="button"
              role="tab"
              aria-controls="bio"
              aria-selected="true"
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content" id="nav-tabContent">
        <div
          className={`tab-pane fade ${
            props.tabs[activeIndex] ? "show active" : ""
          }`}
          id="nav-bio"
          role="tabpanel"
          aria-labelledby="bio-tab"
        >
          {props.tabs[activeIndex].content}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
