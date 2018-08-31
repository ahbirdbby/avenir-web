/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Switch, Route, Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import style from "assets/jss/material-dashboard-react/components/appHeaderStyle.jsx";



class AppHeader extends React.Component {

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
      }

    render() { 
        const { classes, routes } = this.props;
    
        const color = "red";
        var links = (
          <ul className={classes.ul}>
            {routes.map((prop, key) => {
              if (prop.redirect) return null;
              var listItemClasses = classNames({
                  [" " + classes[color]]: this.activeRoute(prop.path)
                });
              
              return (
                <NavLink
                  to={prop.path}
                  className={classes.item}
                  activeClassName="active"
                  key={key}
                >
                  <li className={classes.li + listItemClasses}>
                    {prop.sidebarName}
                  </li>
                </NavLink>
              );
            })}
          </ul>
        );

        return (
            <AppBar position="static" className={classes.root}>
            <Toolbar>
            <Typography variant="title" color="inherit" className={classes.title}>
              Avenir Web
            </Typography>
            {links}
            </Toolbar>
          </AppBar>
        );
    }
}

AppHeader.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
export default withStyles(style)(AppHeader);