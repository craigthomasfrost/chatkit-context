import React, { Component } from 'react';
import styles from './index.module.css';

class Image extends Component {
  state = {
    url: '',
  };

  componentDidMount() {
    const payload = this.props.payload;
    payload.url().then(url => this.setState({ url, name: payload.name }));
  }

  render() {
    return (
      <img src={this.state.url} alt={this.state.name} className={styles.img} />
    );
  }
}

export default Image;
