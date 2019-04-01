import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '../../components/Avatar';
import { Typography } from '@material-ui/core';

const style = theme => ({
  data: {
    // TODO usar margin spacing
    margin: '80px 40px',
  },
  card: {
    display: 'flex',
    // TODO usar margin spacing
    margin: '5vh 0',
    height: '70vh',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    // background: '#34465D',
    background: theme.palette.primary.main,
    minHeight: '100px',
  },
  label: {
    // textTransform: 'uppercase',
    color: theme.palette.primary.dark,
  },
});

class UserData extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    const Profile = [
      { name: 'name', value: 'Luiz Nicolaci da Costa' },
      { name: 'Email', value: 'ldacosta@linea.gov.br' },
      { name: 'Afilliation', value: 'LIneA' },
      { name: 'Joined', value: '12-12-2019' },
      { name: 'UserName', value: 'Luiz da Costa' },
    ];
    const dataProfile = Profile.map((el, i) => {
      return (
        <div key={i}>
          <Typography className={classes.label} variant="body1">
            {el.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {el.value}
          </Typography>
        </div>
      );
    });

    return (
      <Grid container>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Grid item xs={12}>
              <CardContent className={classes.content}>
                <Avatar />
              </CardContent>
              <div className={classes.data}>{dataProfile}</div>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(style)(UserData);
