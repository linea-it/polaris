import { createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

const light = createMuiTheme({
  palette: {
    primary: {
      light: '#5c6b7d',
      main: '#34465d',
      dark: '#243141',
      contrastText: '#fff',
    },
    secondary: pink,
    type: 'light',
  },
  typography: {
    fontSize: 16,
    useNextVariants: true,
  },
  overrides: {
    Pagination: {
      activeButton: {
        color: pink[500],
      },
    },
  },
});

export default light;
