import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@material-ui/core';
import Logo from '../assets/img/icon-des.png';
import HomeIcon from '@material-ui/icons/Home';

const styles = {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  },
  AppBar: {
    boxShadow: 'none',
  },
  separatorToolBar: {
    flexGrow: 1,
  },
};

const homeUrl = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? ':' : ''
}${window.location.port}`;
  
class Header extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <header className={classes.root}>
        <AppBar className={classes.AppBar} position="fixed">
          <Toolbar variant="dense">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              href={homeUrl}
            >
              <img src={Logo} alt="Portal" />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Job Monitor
            </Typography>
            <div className={classes.separatorToolBar} />
            <Button
                color="inherit"
                size="large"
                href={homeUrl}
            >
              <HomeIcon /> 
            </Button>
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

export default withStyles(styles)(Header);
