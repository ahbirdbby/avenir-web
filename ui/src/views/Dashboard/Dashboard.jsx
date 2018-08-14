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

import ListTable from "components/Table/ListTable.jsx"

import Codemirror from 'react-codemirror';

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import SvgIcon from '@material-ui/core/SvgIcon';

import Client from 'Client.js';

require('codemirror/lib/codemirror.css');
require('codemirror/mode/sql/sql');

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

function ArrowRight(props) {
  return (
    <SvgIcon {...props}>
      <path  d="M10,17L15,12L10,7V17Z" />
    </SvgIcon>
  );
}

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
      <div style={style.base} >
      { node.iconType == 'DATABASE' && <DatabaseIcon />}
      { node.iconType == 'TABLE' && <TableIcon />}
      { !node.iconType && <TablesIcon />}
        <div>        
            <span>{node.name}</span>
        </div>
        </div>
    );
}
};

const options = {
  mode: 'text/x-hive',
  lineNumbers: true,
  readOnly: false,
  indentWithTabs: true,
  smartIndent: true,
  matchBrackets: true,
  autofocus: false,
  lineWrapping: true,
  scrollbarStyle: null,
  inputStyle: 'textarea'
}

class Dashboard extends React.Component {
  state = {
    value: 0,
    open: false,
    connections: [],
    databases: [],
    remoteDatabases: [],
    sql: '   select * from xmysql.item',
    columns:[],
    data: []
  };

  async componentDidMount() {
    this.refreshDatabaseTree();
  }

  refreshDatabaseTree = () => {
    Client.getDatabases(databases => {
      let locals = [], remotes = [];
      let remoteDbs = databases.remoteDatabases, localDbs = databases.localDatabases;
      localDbs.map(db => {   
        db.tables.map(tbl => {tbl.iconType = 'TABLE', tbl.parent = db})
        let tables = {name: 'tables', children: db.tables}
        locals.push({name: db.name, iconType: 'DATABASE', children: [tables]});
      });
      this.setState({databases: locals});
      remoteDbs.map(db => {   
        db.tables.map(tbl => {tbl.iconType = 'TABLE', tbl.parent = db})
        let tables = {name: 'tables', children: db.tables}
        remotes.push({name: db.name, iconType: 'DATABASE', children: [tables]});
      });
      this.setState({remoteDatabases: remotes});
    })
  }

  closeConnectionDialog = (connection) => {
    let connections = this.state.connections;
    if (connection && connection.id == null) {
      connection.id = connections.length;
      connections.push(connection);

      Client.mapDatabase({...connection, databaseType: connection.type.value, from: connection.schema, to: connection.toSchema, port: parseInt(connection.port)}, result => {
        this.refreshDatabaseTree();
      })
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

  onRemoteToggle = (node, toggled) => {
    if(this.state.remoteCursor){this.state.remoteCursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ remoteCursor: node });
  }

  mapTable = () => {
    let node = this.state.remoteCursor;
    if (node && node.iconType == "TABLE") {
      let data = {from: node.name,
        to: node.name,
        databaseName: node.parent.name
      };
      Client.mapTable(data, result => {
        this.refreshDatabaseTree();
      })
    } else {

    }
  }

  unmapTable = () => {
    let node = this.state.cursor;
    if (node && node.iconType == "TABLE") {
      Client.unmapTable(node.parent.name, node.name, result => {
        this.refreshDatabaseTree();
      })
    } else {

    }
  }

  unmapDatabase = () => {
    let node = this.state.cursor;
    if (node && node.iconType == "DATABASE") {
      Client.unmapDatabase(node.name, result => {
        this.refreshDatabaseTree();
      })
    } else {

    }
  }

  updateSql = (newSql) => {
    this.setState({sql: newSql});
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div>
          <Button variant="fab" color="primary" aria-label="Add" className={classes.button} onClick={this.openConnectionDialog}>
            <AddIcon />
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
              title="Remote"
              headerColor="info"
              tabs={[
                {
                  tabName: "Databases",
                  tabIcon: ConnectIcon,
                  tabContent: (
                    <Treebeard
                      data={this.state.remoteDatabases}
                      onToggle={this.onRemoteToggle}
                      decorators={dec}
                      style={TreebeardStyle}
                    />
                  )
                }
              ]}
              buttons={<Button variant="contained" color="secondary" onClick={this.mapTable}>
                Map Table
            </Button>}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <CustomTabs
              title="Local"
              headerColor="info"
              tabs={[
                {
                  tabName: "Databases",
                  tabIcon: ConnectIcon,
                  tabContent: (
                    <Treebeard
                      data={this.state.databases}
                      onToggle={this.onToggle}
                      decorators={dec}
                      style={TreebeardStyle}
                    />
                  )
                }
              ]}
              buttons={<div><Button variant="contained" color="primary" onClick={this.unmapTable} style={{ marginRight: '5px' }}>
                Unmap Table
            </Button>
                <Button variant="contained" color="primary" onClick={this.unmapDatabase}>Unmap Database</Button></div>}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}></GridItem>
        </Grid>
        <Codemirror value={this.state.sql} onChange={this.updateSql} options={options} />

        <ListTable columns={this.state.columns} data={this.state.data} />
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
