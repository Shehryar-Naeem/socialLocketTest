import { useState } from "react";
import moment from "moment";
import useNotification from "./useNotification";
import UserImage from "../../assets/images/empty-box.png";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import LoadingSpinner from "../../components/messageModal/LoadingSpinner";
import { Link } from "react-router-dom";
import Avatar from "../../components/image/Avatar";
import NotificationCard from "./NotificationCard";

const Notification = () => {
  const { isLoading, personalNotification, generalNotification } =
    useNotification(1);
  const [tabIndex, setTabIndex] = useState(1);
  const getUserUrl = ({ forename, surName, userId }) => {
    const fullName = forename + " " + surName;
    const userProfileUrl = fullName.concat("_", userId);
    return userProfileUrl;
  };
  return (
    <div>
      <div>
        <ul className="breadcrumb">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/settings/details"> Settings</a>
          </li>
          <li>
            <a href="/" className="active">
              {" "}
              Notification
            </a>
          </li>
        </ul>
      </div>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Global Notification</Tab>
          <Tab>Personal Notification</Tab>
        </TabList>
        <TabPanel>
          <div className="box-shadow p-0">
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
              >
                <LoadingSpinner size={18} />
              </div>
            ) : !generalNotification?.data?.length ? (
              <div div className="box-shadow">
                No Data Found
              </div>
            ) : (
              <div className="notification notification-listview">
                <ul className="p-3">
                  {console.log({ generalNotification })}
                  {generalNotification?.data?.map((item, index) => (
                    <NotificationCard key={index + ""} item={item} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="box-shadow p-0">
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
              >
                <LoadingSpinner size={18} />
              </div>
            ) : !personalNotification?.data?.length ? (
              <div div className="box-shadow">
                No Data Found
              </div>
            ) : (
              <div className="notification notification-listview">
                <ul className="p-3">
                  {personalNotification?.data?.map((item, index) => (
                    <NotificationCard key={index + ""} item={item} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Notification;
