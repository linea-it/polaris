import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SimpleTabs from '../components/Tabs.js';

const styles = {
  root: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    minHeight: 'inherit',
    background: 'inherit',
  },
};

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    return (
      <section className={classes.root}>
        <div className={classes.container}>
          <SimpleTabs />
        </div>
      </section>
    );
  }
}

export default withStyles(styles)(Main);
