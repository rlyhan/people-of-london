import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

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
            <p className={styles.sidebar__gigList__gig__title}>{gig.name}</p>
            <img
              className={styles.sidebar__gigList__gig__thumb}
              src={filterImagesByAspectRatio(gig.images, "3_2").url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
