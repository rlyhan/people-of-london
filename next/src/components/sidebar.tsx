import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import styles from "./sidebar.module.scss";
import utilsStyles from "../styles/utils.module.scss";
import {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
  filterImagesByAspectRatio,
} from "../helpers/filters";

import Logo from "./logo";

interface SidebarProps {
  gigs: any[];
  setGigList: Dispatch<SetStateAction<any[]>>;
  setSelectedGigId: Dispatch<SetStateAction<string | null>>;
  setModalGigId: Dispatch<SetStateAction<string | null>>;
}

export const Sidebar = ({
  gigs,
  setGigList,
  setSelectedGigId,
  setModalGigId,
}: SidebarProps) => {
  const [filterDate, setFilterDate] = useState(new Date());

  const handleMouseClick = (gigId: string) => {
    setModalGigId(gigId);
  };

  const handleMouseEnter = (gigId: string) => {
    setSelectedGigId(gigId);
  };

  const handleMouseLeave = () => {
    setSelectedGigId(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
            process.env.NEXT_PUBLIC_TICKETMASTER_KEY
          }&city=London&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&eventdate_from=${filterDate.toISOString()}&size=100&sort=date,asc`
        );
        const data = await res.json();
        // Removes events with no venue location
        // Gets events by attraction id (show one event per attraction)
        // Gets today's events only
        const gigs = filterEventsByDate(
          filterEventsByAttractionId(
            filterEventsByExistingVenue(data._embedded.events)
          ),
          filterDate
        );
        setGigList(gigs);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
  }, [filterDate]);

  return (
    <div className={styles.sidebar}>
      <Logo />
      <div className="datepicker">
        <div className="datepicker__label">Choose a date</div>
        <DatePicker
          selected={filterDate}
          onChange={(date: Date) => setFilterDate(date)}
        />
      </div>
      <div className={styles.sidebar__gigList}>
        {gigs.length ? (
          gigs.map((gig) => (
            <div
              className={styles.sidebar__gigList__gig}
              onClick={() => handleMouseClick(gig.id)}
              onMouseEnter={() => handleMouseEnter(gig.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={utilsStyles.aspectRatioImage}>
                <div className={styles.sidebar__gigList__gig__title}>
                  <p className={styles.sidebar__gigList__gig__title__text}>
                    {gig.name}
                  </p>
                </div>
                <div className={utilsStyles.aspectRatioImage__imgWrap}>
                  <img
                    className={utilsStyles.aspectRatioImage__img}
                    src={filterImagesByAspectRatio(gig.images, "3_2").url}
                  />
                </div>
              </div>
              <div className={styles.sidebar__gigList__gig__desc}>
                <p className={styles.sidebar__gigList__gig__desc__text}>
                  {gig._embedded?.venues[0]?.name}
                </p>
                <p className={styles.sidebar__gigList__gig__desc__text}>
                  {moment(gig.dates.start.localDate).format("MMMM Do YYYY")},{" "}
                  {moment(gig.dates.start.localTime, "HH:mm:ss").format(
                    "h:mm A"
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.sidebar__noGigs}>{`No events on this day :(`}</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
