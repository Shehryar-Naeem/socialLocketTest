import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Users from "./components/Users";
import Posts from "./components/Posts";
import "react-tabs/style/react-tabs.css";
import ComingSoon from "../comingSoon/ComingSoon";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Search = () => {
  const { state } = useLocation();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (state?.postTitle) {
      setTabIndex(1);
    }
  }, [state]);
  return (
    <div>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Search Users</Tab>
          <Tab>Search Property</Tab>
          <Tab>Search Tags</Tab>
        </TabList>
        <TabPanel>
          <Users />
        </TabPanel>
        <TabPanel>
          <Posts defaultTitle={state?.postTitle} />
        </TabPanel>
        <TabPanel>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "70vh" }}
          >
            <ComingSoon />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Search;
