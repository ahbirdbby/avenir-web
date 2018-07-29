import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// @material-ui/icons
import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import ConnectIcon from "@material-ui/icons/SettingsInputComponent";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import Table from "components/Table/Table.jsx";
import Tasks from "components/Tasks/Tasks.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import Danger from "components/Typography/Danger.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import PowerIcon from '@material-ui/icons/Power';


import { bugs, website, server } from "variables/general";

import ConnectionDialog from "views/Dashboard/ConnectionDialog.jsx";
import ConnectionTree from "views/Dashboard/ConnectionTree.jsx";
import DatabaseTree from "views/Dashboard/DatabaseTree.jsx";
import {Treebeard, decorators} from 'react-treebeard';
import TreebeardStyle from "assets/jss/material-dashboard-react/components/treebeardStyle.jsx";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import SvgIcon from '@material-ui/core/SvgIcon';

function DatabaseIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
    </SvgIcon>
  );
}

function ArrowRight(props) {
  return (
    <SvgIcon {...props}>
      <path  d="M10,17L15,12L10,7V17Z" />
    </SvgIcon>
  );
}

const data = {
  name: 'root',
  toggled: true,
  children: [
      {
          name: 'parent',
          children: [
              { name: 'child1' },
              { name: 'child2' }
          ]
      },
      {
          name: 'loading parent',
          loading: true,
          children: []
      },
      {
          name: 'parent',
          children: [
              {
                  name: 'nested parent',
                  children: [
                      { name: 'nested child 1' },
                      { name: 'nested child 2' }
                  ]
              }
          ]
      }
  ]
};

const dec = {
  ...decorators,
  Toggle: (props) => {
    return (
      <div style={props.style.base}>
        <ArrowRight />
      </div>
    );
  },
  Header: ({style, node}) => {
    return (
      <div style={style.base}>
      <DatabaseIcon />
        <div>        
            <span>{node.name}</span>
        </div>
        </div>
    );
}
};

class Dashboard extends React.Component {
  state = {
    value: 0,
    open: false,
    connections: [],
    localDatabases: []
  };

  closeConnectionDialog = (connection) => {
    let connections = this.state.connections;
    if (connection && connection.id == null) {
      connection.id = connections.length;
      connections.push(connection);
    } else {

    }

    this.setState(prev => ({...prev, open: false, connections: connections}));
  };

  openConnectionDialog = (conn) => {
    if (conn != null) {
      this.setState({selectedCon: conn});
    }

    this.setState({open: true});
  }

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  onToggle = (node, toggled) => {
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
            <div>
      <Button variant="fab" color="primary" aria-label="Add" className={classes.button} onClick={this.openConnectionDialog}>
        <AddIcon />
      </Button>
      <Button variant="fab" color="secondary" aria-label="Edit" className={classes.button}>
        <Icon>edit_icon</Icon>
      </Button>
      <Button variant="extendedFab" aria-label="Delete" className={classes.button}>
        <NavigationIcon className={classes.extendedIcon} />
        Extended
      </Button>
      <Button variant="fab" disabled aria-label="Delete" className={classes.button}>
        <DeleteIcon />
      </Button>

      <ConnectionDialog
            open={this.state.open}
            onClose={this.closeConnectionDialog}
            value={this.state.selectedCon}
          />
    </div>
        <Grid container>
          <GridItem xs={12} sm={12} md={6}>
            <CustomTabs
              title=""
              headerColor="primary"
              tabs={[
                {
                  tabName: "Connections",
                  tabIcon: ConnectIcon,
                  tabContent: (
                    <ConnectionTree connections={this.state.connections} openConnectionDialog={this.openConnectionDialog}/>
                  )
                }
              ]}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
              title=""
              headerColor="info"
              tabs={[
                {
                  tabName: "Object Explorer",
                  tabIcon: ConnectIcon,
                  tabContent: (
                    <List dense disablePadding
                    >
                      <ListItem button>
                        <ListItemIcon>
                          <DatabaseIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Database" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Drafts" />
                      </ListItem>
                      <ListItem button onClick={this.handleClick}>
                      {this.state.open ? <ExpandLess /> : <ExpandMore />}
                        <ListItemIcon>
                          <InboxIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Inbox" />
                      </ListItem>
                      <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <StarBorder />
                            </ListItemIcon>
                            <ListItemText inset primary="Starred" />
                          </ListItem>
                        </List>
                      </Collapse>
                    </List>
                  )
                }
              ]}
            />
          </GridItem>
        </Grid>
        <Grid container>
          <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
              title="Local"
              headerColor="info"
              tabs={[
                {
                  tabName: "Object Explorer",
                  tabIcon: ConnectIcon,
                  tabContent: (
                    <Treebeard
                data={data}
                onToggle={this.onToggle}
                decorators={dec}
                style={TreebeardStyle}
            />
                  )
                }
              ]}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}></GridItem>
          </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
