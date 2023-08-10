import React, { useEffect, useState } from "react";

import styles from "./home.module.scss";

interface SidebarProps {
  gigs: any[];
}

export const Sidebar = ({ gigs }: SidebarProps) => {
  const [filteredGigs, setFilteredGigs] = useState([]);

  useEffect(() => {
    setFilteredGigs(gigs);
    console.log(gigs);
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__gigList}>
        {filteredGigs?.map((gig) => (
          <div className={styles.sidebar__gigList__gig}>
            <p className={styles.sidebar__gigList__gig__title}>{gig.name}</p>
            <img
              className={styles.sidebar__gigList__gig__thumb}
              src={gig.images[0]?.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
