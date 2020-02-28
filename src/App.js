import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import light from './themes/light';
import dark from './themes/dark';
import Home from './views/home/home';
import useLocalState from './utils/useLocalState';

function App() {
  const [theme, setTheme] = useLocalState('theme', 'light');

  const handleThemeSwitch = () =>
    setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <MuiThemeProvider theme={theme === 'light' ? light : dark}>
      <Home theme={theme} handleThemeSwitch={handleThemeSwitch} />
    </MuiThemeProvider>
  );
}

export default App;
