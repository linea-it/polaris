import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import Logo from '../assets/img/icon-des.png';
import Switch from '@material-ui/core/Switch';

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
  toolbar: {
    justifyContent: 'space-between',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
};

class Header extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes, theme, handleThemeSwitch } = this.props;

    return (
      <header className={classes.root}>
        <AppBar className={classes.AppBar} position="fixed">
          <Toolbar variant="dense" className={classes.toolbar}>
            <div className={classes.titleWrapper}>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <img src={Logo} alt="Portal" />
              </IconButton>

              <Typography variant="h6" color="inherit">
                Portal Monitor
              </Typography>
            </div>
            <Switch
              checked={theme === 'light'}
              onChange={handleThemeSwitch}
              value={theme}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

export default withStyles(styles)(Header);
