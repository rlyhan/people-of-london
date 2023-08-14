import React, { Dispatch, SetStateAction } from "react";
import moment from "moment";

import styles from "./modal.module.scss";
import utilsStyles from "../styles/utils.module.scss";
import {
  filterImagesByAspectRatio,
  findLargestImage,
} from "../helpers/filters";

interface SidebarProps {
  gig: any;
  setModalGigId: Dispatch<SetStateAction<string | null>>;
}

const Modal = ({ gig, setModalGigId }: SidebarProps) => {
  const handleClick = () => {
    setModalGigId(null);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalBackground}></div>
      <div className={styles.modal}>
        <div className={styles.modal__closeBtn} onClick={handleClick}>
          <div className={styles.modal__closeBtn__icon}>X</div>
        </div>
        <div className={styles.modal__wrap}>
          <div className={utilsStyles.aspectRatioImage}>
            <p className={styles.modal__title}>{gig.name}</p>
            <div className={utilsStyles.aspectRatioImage__imgWrapLarge}>
              <img
                className={utilsStyles.aspectRatioImage__img}
                src={
                  findLargestImage(filterImagesByAspectRatio(gig.images, "3_2"))
                    .url
                }
              />
            </div>
          </div>
          <div className={styles.modal__content}>
            <div className={styles.modal__content__flexWrapper}>
              <p className={styles.modal__content__text}>
                {gig._embedded?.venues[0]?.name}
                <br></br>
                {moment(gig.dates.start.localDate).format("MMMM Do YYYY")},{" "}
                {moment(gig.dates.start.localTime, "HH:mm:ss").format("h:mm A")}
              </p>
              <div className={styles.modal__content__buyBtn}>
                <a
                  className={styles.modal__content__buyBtn__link}
                  href={gig.url}
                  target="__blank"
                >
                  Purchase tickets
                </a>
              </div>
            </div>
            {gig.info && (
              <>
                <p
                  className={styles.modal__content__text__description__heading}
                >
                  About this event
                </p>
                <p className={styles.modal__content__text__description}>
                  {gig.info}
                </p>
              </>
            )}
            {gig.pleaseNote && (
              <>
                <p
                  className={styles.modal__content__text__description__heading}
                >
                  Please note
                </p>
                <p className={styles.modal__content__text__description}>
                  {gig.pleaseNote}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
