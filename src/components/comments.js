/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    minWidth: '600px',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  divider: {
    marginLeft: 0,
  },
}));

function Comments(props) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {props.commentsProcess.map((item, i) => {
        return (
          <>
            <ListItem alignItems="flex-start" key={i}>
              <ListItemText
                primary={`${item.user.displayName} - ${moment(item.date).format(
                  'LLL'
                )} `}
                secondary={item.comments}
              />
            </ListItem>
            <Divider
              className={classes.divider}
              variant="inset"
              component="li"
            />
          </>
        );
      })}
    </List>
  );
}

export default Comments;
