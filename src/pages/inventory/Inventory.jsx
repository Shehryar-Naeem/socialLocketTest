/* eslint-disable react/no-unescaped-entities */
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import InventoryTab from "./components/InventoryTab";
import { useState } from "react";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [defaultIndex, setDefaultIndex] = useState(2); // Set default index to 2 for "Potential" tab
  return (
    <div className="container-adjustment main-inventory">
      <div>
        <ul className="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/settings/details"> Settings</Link>
          </li>
          <li>
            <Link to="/inventory" className="active">
              Inventory
            </Link>
          </li>
        </ul>
      </div>

      <div className="inventory-tabs">
        <Tabs
          defaultIndex={defaultIndex}
          onSelect={(index) => setDefaultIndex(index)}
        >
          <TabList>
            <Tab>Sold</Tab>
            <Tab>Purchased</Tab>
            <Tab>Potential</Tab>
          </TabList>
          <TabPanel>
            <InventoryTab type="sold" />
          </TabPanel>
          <TabPanel>
            <InventoryTab type="purchased" />
          </TabPanel>
          <TabPanel>
            <InventoryTab type="potential" />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
