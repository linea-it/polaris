import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Toolbar } from '@material-ui/core';
import logo from '../assets/img/linea-logo-mini.png';
import git_json from '../assets/json/version.json';

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
  versionLink: {
    color: '#d2cf00',
    textDecoration: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

class Footer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  openLineaWebSite = () => {
    window.open('http://www.linea.gov.br/', 'linea');
  };

  openGithub = vlink => {
    if (vlink) {
      window.open(vlink);
    }
  };

  render() {
    const { classes } = this.props;

    const instance =
      process.env.NODE_ENV === 'production'
        ? window._env_.REACT_APP_INSTANCE
        : process.env.REACT_APP_INSTANCE;

    let version = '--';
    let vlink = null;

    if (
      Object.entries(git_json).length !== 0 &&
      git_json.constructor === Object
    ) {
      if (git_json.tag) {
        version = `${git_json.tag}`;
        vlink = `${git_json.url}`;
      } else {
        version = `${git_json.sha.substring(0, 7)}`;
        vlink = `${git_json.url.replace(/.git$/, '')}/commit/${
          git_json.git.sha
        }`;
      }
    }

    return (
      <footer className={classes.root}>
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography color="inherit" className={classes.grow}>
              {instance} Portal:{' '}
              <span
                onClick={() => this.openGithub(vlink)}
                className={classes.versionLink}
              >
                {version}
              </span>
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
