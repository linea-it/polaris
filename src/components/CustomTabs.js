import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
  },
  tabs: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    width: '100%',
  },

  tab: {
    margin: 0,
    padding: 0,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [components, setComponents] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    console.log(components);
  }, [components]);

  const handleTabChange = (event, value) => setTabValue(value);
  const handleTabIndexChange = value => setTabValue(value);

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          className={classes.tabs}
          indicatorColor="primary"
          onChange={handleTabChange}
          variant="fullWidth"
        >
          {components.map((component, i) => (
            <Tab
              key={component.id}
              label={component.display_name}
              {...a11yProps(i)}
            />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabValue}
        onChangeIndex={handleTabIndexChange}
      >
        {components.map((component, i) => (
          <TabPanel
            key={component.id}
            value={tabValue}
            index={i}
            dir={theme.direction}
          ></TabPanel>
        ))}
      </SwipeableViews>
    </>
  );
}

export default CustomTabs;
