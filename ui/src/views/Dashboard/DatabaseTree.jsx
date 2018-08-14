import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SvgIcon from '@material-ui/core/SvgIcon';
import Collapse from '@material-ui/core/Collapse';

function DatabaseIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
    </SvgIcon>
  );
}

function TableIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z" />
    </SvgIcon>
  );
}

function TablesIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z" />
    </SvgIcon>
  );
}

const style = theme => ({

});

class DatabaseTree extends React.Component {

    constructor(props) {
      super(props);

      this.state = {dbState:[]}
    }

    handleClick = (expand) => {

    }
  
    render() {
      const { classes, databases:dbs=[], ...other } = this.props;
  
      return (
        <List dense disablePadding>
          {
            dbs.map((db, index) => {
              return [<ListItem button key={index}>
                {db.expand == true ? <ExpandLess /> : <ExpandMore />}
                <ListItemIcon>
                  <DatabaseIcon />
                </ListItemIcon>
                <ListItemText inset primary={db.databaseName} />
              </ListItem>,
              <Collapse in={db.expand} timeout="auto" unmountOnExit>
                <List dense disablePadding>
                  <ListItem button className={classes.nested}>
                    {db.tables.expand == true ? <ExpandLess /> : <ExpandMore />}
                    <ListItemIcon>
                      <TablesIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Tables" />
                  </ListItem>
                  <Collapse in={db.tables.expand} timeout="auto" unmountOnExit>
                    <List dense disablePadding>
                      {db.tables.map((tb, tbIndex) => {
                        return <ListItem button className={classes.nested} key={tbIndex}>
                          <ListItemIcon>
                            <TablesIcon />
                          </ListItemIcon>
                          <ListItemText inset primary={tb.tableName} />
                        </ListItem>;
                      })}
                    </List>
                  </Collapse>
                </List>
              </Collapse>];
            })
          }
        </List>
      );
    }
  }

  DatabaseTree.propTypes = {
    classes: PropTypes.object.isRequired,
    databases: PropTypes.arrayOf(PropTypes.shape({
        databaseName: PropTypes.string.isRequired,
        tables: PropTypes.arrayOf(PropTypes.shape({
          tableName: PropTypes.string.isRequired
        }))
    }))
  };
  
  export default withStyles(style)(DatabaseTree);