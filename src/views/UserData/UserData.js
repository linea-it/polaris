import React from 'react';
import Grid from '@material-ui/core/Grid';
import Profile from './Profile';
import Groups from './Groups';

class UserData extends React.Component {
  render() {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={24}
      >
        <Grid item sm={12} md={4} xl={6}>
          <Profile />
        </Grid>
        <Grid item sm={12} md={4} xl={6}>
          <Groups />
        </Grid>
      </Grid>
    );
  }
}

export default UserData;
