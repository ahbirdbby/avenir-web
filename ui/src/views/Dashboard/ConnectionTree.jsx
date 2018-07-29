import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PowerIcon from '@material-ui/icons/Power';
import SvgIcon from '@material-ui/core/SvgIcon';

function PowerOffIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M8,3V6.18C11.1,9.23 14.1,12.3 17.2,15.3C17.4,15 17.8,14.8 18,14.4V8.8C18,7.68 16.7,7.16 16,6.84V3H14V7H10V3H8M3.28,4C2.85,4.42 2.43,4.85 2,5.27L6,9.27V14.5C7.17,15.65 8.33,16.83 9.5,18V21H14.5V18C14.72,17.73 14.95,18.33 15.17,18.44C16.37,19.64 17.47,20.84 18.67,22.04C19.17,21.64 19.57,21.14 19.97,20.74C14.37,15.14 8.77,9.64 3.27,4.04L3.28,4Z" />
      </SvgIcon>
    );
  }

const style = theme => ({

});

class ConnectionTree extends React.Component {

    constructor(props) {
      super(props);
    }

    doubleClick = (conn) => {
        this.props.openConnectionDialog(conn);
    }
  
    render() {
      const { classes, connections = [], ...other } = this.props;
  
      return (
          <List dense disablePadding
          >
          {
              connections.map((conn, index) => {
                 let display = conn.user + "@" + conn.host + ":" + conn.port + " - " + conn.type.label;
                return <ListItem button onDoubleClick={this.doubleClick.bind(this, conn)} key={index}>
                <ListItemIcon>
                     {conn.connectted ? <PowerIcon /> : <PowerOffIcon />}
                </ListItemIcon>
                <ListItemText inset primary={display} />
            </ListItem>;
              })
          }
          </List>
      );
    }
  }

  ConnectionTree.propTypes = {
    classes: PropTypes.object.isRequired,
    connctions: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.object.isRequired,
        host: PropTypes.string.isRequired,
        port: PropTypes.number.isRequired,
        user: PropTypes.string,
        connectted: PropTypes.bool.isRequired
    }))
  };
  
  export default withStyles(style)(ConnectionTree);