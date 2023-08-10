import React, { Component } from "react";

import styles from "./home.module.scss";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <div className={styles.sidebar}></div>;
  }
}

export default Sidebar;
