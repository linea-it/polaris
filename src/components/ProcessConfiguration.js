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
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CustomList from './CustomList';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

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
  roundedTabs: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
    paddingTop: 5,
    paddingBottom: 5,
  },
  headerTitle: {
    color: theme.palette.primary.contrastText,
    fontSize: '0.92rem',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  checkCircle: {
    fontSize: 16,
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
      <Box p={2}>{children}</Box>
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

function ProcessConfiguration({ open, maxWidth, onClose, configuration }) {
  const classes = useStyles();
  const theme = useTheme();
  const [components, setComponents] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);

  useEffect(() => {
    if (open) {
      if (configuration.job.components.component._attributes) {
        setComponents(
          [configuration.job.components.component].filter(
            component => Object.entries(component.config).length !== 0
          )
        );
      } else {
        setComponents(
          configuration.job.components.component.filter(
            component => Object.entries(component.config).length !== 0
          )
        );
      }
    }
  }, [open, configuration]);

  useEffect(() => {
    // console.log(components);
  }, [components]);

  const handleTabChange = (event, value) => {
    setSubTabValue(0);
    setTabValue(value);
  };
  const handleTabIndexChange = value => {
    setSubTabValue(0);
    setTabValue(value);
  };

  const handleSubTabChange = (event, value) => setSubTabValue(value);

  const renderTabs = tabs => {
    return tabs.map((component, i) => {
      return (
        <Tab
          key={component._attributes.id}
          label={component._attributes.display_name}
          {...a11yProps(i)}
        />
      );
    });
  };

  const renderTabSection = section => {
    return section.map((component, i) => {
      return (
        <TabPanel
          key={component._attributes.id}
          value={tabValue}
          index={i}
          dir={theme.direction}
        >
          <AppBar position="static" className={classes.roundedTabs}>
            {renderSubTabs(component.config.section)}
          </AppBar>
          <TabPanel
            value={subTabValue}
            index={subTabValue}
            dir={theme.direction}
          >
            {renderSubTabSection(component.config.section)}
          </TabPanel>
        </TabPanel>
      );
    });
  };

  const renderSubsectionPanels = subsection => {
    const row = subsection._attributes ? [subsection] : subsection;

    return row.map((el, i) => {
      let scalar = [];
      let checkbox = [];

      if (el.scalar) {
        scalar = el.scalar._attributes ? [el.scalar] : el.scalar;
      }

      if (el.checkbox) {
        checkbox = el.checkbox._attributes ? [el.checkbox] : el.checkbox;
      }

      if (scalar.length > 0 || checkbox.length > 0) {
        return (
          <Grid key={i} item xs={12}>
            <Card>
              <CardHeader
                title={
                  <span className={classes.headerTitle}>
                    {el._attributes.id}
                  </span>
                }
                className={classes.cardHeader}
              />
              <CardContent>
                {scalar.length > 0 ? (
                  <CustomList
                    data={scalar.map(s => ({
                      title: s._attributes.name,
                      // eslint-disable-next-line react/display-name
                      value: () =>
                        s._attributes.name === s._attributes.value ? (
                          <CheckCircleIcon
                            title={s._attributes.value}
                            className={classes.checkCircle}
                          />
                        ) : (
                          s._attributes.value
                        ),
                      dense: true,
                    }))}
                  />
                ) : null}
                {checkbox.length > 0 ? (
                  <CustomList
                    data={checkbox.map(s => ({
                      title: s._attributes.name,
                      // eslint-disable-next-line react/display-name
                      value: () =>
                        s._attributes.name === s._attributes.value ? (
                          <CheckCircleIcon
                            title={s._attributes.value}
                            className={classes.checkCircle}
                          />
                        ) : (
                          s._attributes.value
                        ),
                      dense: true,
                    }))}
                  />
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        );
      }
    });
  };

  const renderSubTabs = tab => {
    if (tab && tab._attributes && tab._attributes.id) {
      return (
        <Tabs
          value={subTabValue}
          className={clsx(classes.tabs, classes.roundedTabs)}
          indicatorColor="primary"
          onChange={handleSubTabChange}
          variant="fullWidth"
        >
          <Tab
            key={tab._attributes.id}
            label={tab._attributes.id}
            {...a11yProps(0)}
          />
        </Tabs>
      );
    } else if (tab && tab.length > 0) {
      return (
        <Tabs
          value={subTabValue}
          className={clsx(classes.tabs, classes.roundedTabs)}
          indicatorColor="primary"
          onChange={handleSubTabChange}
          variant="fullWidth"
        >
          {tab.map((section, i) => (
            <Tab
              key={section._attributes.id}
              label={section._attributes.id}
              {...a11yProps(i)}
            />
          ))}
        </Tabs>
      );
    }
  };

  const renderSubTabSection = section => {
    if (section) {
      return section.subsection ? (
        <Grid container spacing={2}>
          {section._attributes
            ? renderSubsectionPanels(section.subsection)
            : null}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {section[subTabValue]
            ? renderSubsectionPanels(section[subTabValue].subsection)
            : null}
        </Grid>
      );
    }
  };

  const handleClose = () => {
    setComponents([]);
    setSubTabValue(0);
    setTabValue(0);
    onClose();
  };

  return components.length > 0 ? (
    <Dialog onClose={handleClose} open={open} maxWidth={maxWidth} fullWidth>
      <DialogContent className={classes.root}>
        <DialogContentText>
          <AppBar position="static">
            <Tabs
              value={tabValue}
              className={classes.tabs}
              indicatorColor="primary"
              onChange={handleTabChange}
              variant="fullWidth"
            >
              {renderTabs(components)}
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={tabValue}
            onChangeIndex={handleTabIndexChange}
          >
            {renderTabSection(components)}
          </SwipeableViews>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  ) : null;
}

ProcessConfiguration.defaultProps = {
  maxWidth: 'lg',
};

ProcessConfiguration.propTypes = {
  open: PropTypes.bool.isRequired,
  maxWidth: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  configuration: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProcessConfiguration;
