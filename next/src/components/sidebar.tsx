import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import moment from "moment";

import styles from "./home.module.scss";

import {
  filterEventsByAttractionId,
  filterImagesByAspectRatio,
} from "../helpers/filters";

interface SidebarProps {
  gigs: any[];
}

export const Sidebar = ({ gigs }: SidebarProps) => {
  const [filteredGigs, setFilteredGigs] = useState([]);

  useEffect(() => {
    console.log(gigs);
    setFilteredGigs(filterEventsByAttractionId(gigs));
    console.log(filteredGigs);
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__gigList}>
        {filteredGigs?.map((gig) => (
          <div className={styles.sidebar__gigList__gig}>
            <div className={styles.sidebar__gigList__gig__thumb}>
              <div className={styles.sidebar__gigList__gig__title}>
                <p className={styles.sidebar__gigList__gig__title__text}>
                  {gig.name}
                </p>
              </div>
              <div className={styles.sidebar__gigList__gig__thumb__imgWrap}>
                <img
                  className={styles.sidebar__gigList__gig__thumb__img}
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
                {moment(gig.dates.start.localTime, "HH:mm:ss").format("h:mm A")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
