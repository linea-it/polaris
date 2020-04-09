/* eslint-disable no-console */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  btnIco: {
    float: 'right',
  },
};

class CloseModal extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = this.state;
  // }

  render() {
    return (
      <IconButton
        style={styles.btnIco}
        edge="start"
        color="inherit"
        onClick={() => {
          // eslint-disable-next-line react/prop-types
          this.props.callbackParent(true);
        }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
    );
  }
}
export default withStyles(styles)(CloseModal);
