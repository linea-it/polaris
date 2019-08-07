import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';
import DefaultAvatar from '../assets/img/index.jpeg';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  bigAvatar: {
    // TODO usar margin spacing
    marginLeft: 25,
    position: 'absolute',
    width: 140,
    height: 140,
    border: '5px solid #ffffff',
    boxShadow: '1px 1px 1px 1px #c6c6c6',
  },
  nameAvatar: {
    marginLeft: 180,
    marginTop: 40,
    color: theme.palette.primary.contrastText,
  },
}));

function ImageAvatars() {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" spacing={0}>
      <Grid item xs={6} xl={12}>
        <Avatar
          alt="Remy Sharp"
          src={DefaultAvatar}
          className={classes.bigAvatar}
        />
        <Typography variant="h5" className={classes.nameAvatar}>
          Astronomy
        </Typography>
      </Grid>
    </Grid>
  );
}

ImageAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ImageAvatars;
