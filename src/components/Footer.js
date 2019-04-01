import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Toolbar } from '@material-ui/core';
import logo from '../assets/img/linea-logo-mini.png';

const styles = {
  grow: {
    flexGrow: 1,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

class Footer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  openLineaWebSite = () => {
    window.open('http://www.linea.gov.br/', 'linea');
  };

  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.root}>
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.grow} color="inherit">
              Developer Portal Instance
            </Typography>
            <Typography color="inherit">Powered by</Typography>
            <img
              src={logo}
              onClick={this.openLineaWebSite}
              title="LIneA"
              alt="LineA"
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </Toolbar>
        </AppBar>
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);
