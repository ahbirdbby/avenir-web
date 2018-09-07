import React from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "perfect-scrollbar";
import classNames from "classnames";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import Button from '@material-ui/core/Button';

import Select from 'react-select';
//self
import TreeSidebar from "components/Sidebar/TreeSidebar.jsx";

import ListTable from "components/Table/ListTable.jsx"
import ErrorBoundary from "common/ErrorBoundary.jsx"

import Codemirror from 'react-codemirror';

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import Client from 'Client.js';
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

require('codemirror/lib/codemirror.css');
require('codemirror/mode/sql/sql');

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

  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      sql: '  //select * from xmysql.item',
      columns:[],
      data: [],
      querying: false,
      directPushdown: false,
      remoteDatabases: []
    };
  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      new PerfectScrollbar(this.refs.mainPanel);
    }
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if(this.state.mobileOpen){
        this.setState({mobileOpen: false});
      }
    }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  updateSql = (newSql) => {
    this.setState({sql: newSql});
  }

  runQuery = () => {
    if (this.state.directPushdown && this.state.directPushDB === undefined) {
      window.notification.error("Please select one remote database where the query will be pushed down to.");
      return;
    }

    let sql = this.state.sql;
    if (this.state.directPushdown) {
      const hint = "/*+ DIRECT('" + this.state.directPushDB.value + "') */ ";
      sql = hint + sql;
    }
    this.setState({querying: true});

    Client.runQuery(sql, result => {
      let cols = result.columns.map(c => { return { id: c.name, dataType: c.dataType, label: c.name } });
      let data = result.rows.map((r, i) => {
        let newR = { 'ROW_#_ID': ++i };
        result.columns.map((c, index) => {
          newR[c.name] = r[index];
          return c;
        })
        return newR;
      });

      this.setState({ columns: cols, data: data, querying: false });
    }, { throwError: true }).catch(err => {
      this.setState({ querying: false });
    });
  }

  switchMode = () => {
    const old = this.state.directPushdown;
    this.setState({directPushdown: !old});
  }

  setRemoteDatabases = dbs => {
    const options = dbs.map(db => {
      return {value: db.name, label: db.name};
    });
    this.setState({remoteDatabases: options});
  }

  selectRemoteDatabase = value => {
    this.setState({directPushDB: value});
  }

  render() {
    const { classes, ...rest } = this.props;
    const {querying, directPushdown} = this.state;

    return (
      <ErrorBoundary>        
        <TreeSidebar
          open={this.state.mobileOpen}
          handleDrawerToggle={this.handleDrawerToggle}
          setRemoteDatabases={this.setRemoteDatabases}
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
        <SnackbarContent
            variant="info"
            innerRef={(el) => {window.notification = el}}
            show={false}
          />
          <div className={classes.content}>
            <div style={{ paddingBottom: 15 }}>
              <div className={classes.wrapper}>
                <Button aria-label="Run Query" color="primary" variant="contained" className={classes.button} onClick={this.runQuery} disabled={querying}>
                  Run Query
                </Button>
                {querying && <CircularProgress size={24} className={classes.buttonProgress} />}
                <FormControlLabel style={{paddingLeft: 10}}
                control={
                  <Checkbox
                    checked={this.state.directPushdown}
                    onChange={this.switchMode}
                    indeterminate
                  />
                }
                label="Direct Pushdown"
                />
                <Select
                  value={this.state.directPushDB}
                  onChange={this.selectRemoteDatabase}
                  options={this.state.remoteDatabases}
                  className={classNames({[classes.select]: true, [classes.showSelect]: directPushdown})}
                  placeholder='Select a remote database'
                />
              </div>            
              <Hidden mdUp>
                <IconButton
                  className={classes.button}
                  style={{ float: 'right' }}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.handleDrawerToggle}
                >
                  <Menu />
                </IconButton>
              </Hidden>
            </div>
            <Codemirror value={this.state.sql} onChange={this.updateSql} options={options} />
            <div className={classes.wrapper}>
              <ListTable columns={this.state.columns} data={this.state.data} />
              {querying && <CircularProgress size={68} className={classes.fabProgress} />}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
