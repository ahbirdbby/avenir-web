import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import questLogo from '../images/tic-logo200x200.png';

const styles = theme => ({
    header: {
        height: '70px',
        borderBottom: '2px solid #fb4e14',
        textAlign: 'left'
    },
    logo: {
        padding: '15px 0',
        height: '70px',
        marginLeft: '9px',
        verticalAlign: 'top'
    },
    title: {
        margin: '0 15px 0 20px',
        color: '#333',
        display: 'inline-block',
        fontWeight: 100,
        lineHeight: '70px',
        fontSize: '16px',
        paddingTop: '2px'
    }
});

class Header extends Component {
  constructor(props) {
    super(props);
  }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.header}>
                <Grid container >
                    <Grid item xs={4}>
                        <img src={questLogo} className={classes.logo}></img>
                        <h1 className={classes.title}>
                            <span>Toad Intelligence Central</span>
                        </h1>
                    </Grid>
                    <Grid item xs={8}></Grid>
                </Grid>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Header);
