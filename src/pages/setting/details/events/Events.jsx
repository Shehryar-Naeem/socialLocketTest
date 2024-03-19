import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import events from "./data";
import "./events.css";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getEventsByFromUserId, getEventsByToUserId } from "services/eventsApi";
import LoadingSpinner from "components/messageModal/LoadingSpinner";
import moment from "moment";
function Events({ userId }) {
  useEffect(() => {
    // window.scrollTo(0, 0);
  }, []);

  const { data, isLoading } = useQuery(
    ["event-list", "to", userId],
    () => getEventsByToUserId(userId),
    {
      select: (res) => {
        if (res) {
          let temp = res?.filter((item) => item?.event_accepted === "1");
          return temp?.map((item) => ({
            title: item?.title,
            start: moment(item?.date, "DD/MM/YYYY").toDate(),
            backgroundColor: "purple",
            id: item?.id,
          }));
        }
        return res;
      },
    }
  );

  const { data: fromData, isLoading: isFromLoading } = useQuery(
    ["event-list", "from", userId],
    () => getEventsByFromUserId(userId),
    {
      select: (res) => {
        if (res) {
          let temp = res?.filter((item) => item?.event_accepted === "1");
          return temp?.map((item) => ({
            title: item?.title,
            start: moment(item?.date, "DD/MM/YYYY").toDate(),
            backgroundColor: "purple",
            id: item?.id,
          }));
        }
        return res;
      },
    }
  );

  const [eventData, setEventData] = useState([]);
  useEffect(() => {
    if (!isLoading && !isFromLoading) {
      let temp = [...(data ?? []), ...(fromData ?? [])];
      const uniqueEvents = {};

      temp.forEach((event) => {
        uniqueEvents[event.id] = event;
      });

      const uniqueEventsArray = Object.values(uniqueEvents);
      setEventData(uniqueEventsArray ?? []);
    }
  }, [data, fromData, isLoading, isFromLoading]);

  return isLoading || isFromLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="container-fluid main-inventory">
      {/* <div>
        <ul className="breadcrumb">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/settings/details"> Settings</Link>
          </li>
          <li>
            <Link to="/events" className="active">
              Events
            </Link>
          </li>
        </ul>
      </div> */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        //   weekends={false}
        //   dateClick={(e) => handleDateClick(e)}
        events={eventData}
        eventContent={renderEventContent}
        themeSystem="Simplex"
        dayCellClassNames={"event_dayCellClassNames"}
      />
    </div>
  );
}

export default Events;
// a custom render function
function renderEventContent(eventInfo) {
  console.log({ eventInfo });
  return (
    <>
      {/* <b>{eventInfo.timeText}</b> */}
      <i>{eventInfo.event.title}</i>
    </>
  );
}
