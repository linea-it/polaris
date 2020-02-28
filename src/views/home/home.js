import React from 'react';
import Header from '../../components/Header';
import Main from '../../components/Main';
import Footer from '../../components/Footer';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
  },
}));

function App({ theme, handleThemeSwitch }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header theme={theme} handleThemeSwitch={handleThemeSwitch} />
      <Main className={classes.root} />
      <Footer />
    </div>
  );
}

export default App;
