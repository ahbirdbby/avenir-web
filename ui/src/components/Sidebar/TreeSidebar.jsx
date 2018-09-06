import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
// import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
//self
import Client from 'Client.js';
import ConnectionDialog from "views/Dashboard/ConnectionDialog.jsx";
import {Treebeard, decorators} from 'react-treebeard';
import TreebeardStyle from "assets/jss/material-dashboard-react/components/treebeardStyle.jsx";

import style from "assets/jss/material-dashboard-react/components/treeSidebarStyle.jsx";


function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: "5px" }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

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

function ColumnIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M16,5V18H21V5M4,18H9V5H4M10,18H15V5H10V18Z" />
        </SvgIcon>
    );
}

function ArrowRight(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10,17L15,12L10,7V17Z" />
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
    Header: ({ style, node }) => {
        return (
            <div style={style.base} >
                {node.iconType === 'DATABASE' && <DatabaseIcon />}
                {node.iconType === 'TABLE' && <TableIcon />}
                {node.iconType === 'COLUMN' && <ColumnIcon />}
                {!node.iconType && <TablesIcon />}
                <div>
                    <span>{node.name}</span>
                </div>
            </div>
        );
    }
};

class TreeSidebar extends React.Component {
    state = {
        tab: 0,
        connections: [],
        databases: [],
        remoteDatabases: [],
        loading: false
    };

    async componentDidMount() {
        this.refreshDatabaseTree();
    };

    switchTab = (event, tab) => {
        this.setState({ tab });
    };

    openConnectionDialog = () => {   
        this.setState({popup: true});
    };

    closeConnectionDialog = (connection) => {
        let connections = this.state.connections;
        if (connection) {
            Client.mapDatabase({ ...connection, databaseType: connection.type.value, from: connection.schema, to: connection.toSchema === undefined ? '' : connection.toSchema, port: parseInt(connection.port, 10) }, result => {
                window.notification.success("Success map database.");
                this.refreshDatabaseTree();
            })
        }

        this.setState(prev => ({ ...prev, popup: false, connections: connections }));
    };

    refreshDatabaseTree = () => {
        this.setState({loading: true});

        Client.getDatabases(databases => {
            let locals = [], remotes = [];
            let remoteDbs = databases.remoteDatabases, localDbs = databases.localDatabases;
            localDbs.map(db => {
                build(db, locals);
                return db;
            });
            this.setState({ databases: locals });
            remoteDbs.map(db => {
                build(db, remotes);
                return db;
            });
            this.setState({ remoteDatabases: remotes });
            this.setState({loading: false});

            function build(db, arr) {
                db.tables.map(tbl => { tbl.iconType = 'TABLE'; tbl.parent = db; tbl.children = [{name: 'columns', iconType: 'COLUMNS', tableNode: tbl, children: []}]; return tbl; })
                let tables = { name: 'tables', children: db.tables }
                arr.push({ name: db.name, iconType: 'DATABASE', children: [tables] });
            }
        })
    };

    onToggle = (node, toggled) => {
        if (this.state.cursor) { 
            const cur = this.state.cursor;
            cur.active = false;
            this.setState({cursor: cur});
        }
        node.active = true;
        
        if (node.children) { 
            node.toggled = toggled; 
        }
        this.loadColumns(node, false);
        this.setState({ cursor: node });
    }

    onRemoteToggle = (node, toggled) => {
        if (this.state.remoteCursor) { 
            const cur = this.state.remoteCursor;
            cur.active = false;
            this.setState({remoteCursor: cur});
        }
        node.active = true;
        if (node.children) { node.toggled = toggled; }
        this.loadColumns(node, true);
        this.setState({ remoteCursor: node });
    };

    loadColumns = (node, remote) => {
        if (node.iconType === "COLUMNS" && !node.columnsLoaded) {
            node.loading = true;
            let tableNode = node.tableNode, dbNode = tableNode.parent;
            let state = this.state;
            Client.getColumns(dbNode.name, tableNode.name, remote, cols => {
                cols.map(col => {
                    col.iconType = 'COLUMN';
                    col.parent = tableNode;
                    node.children.push(col);
                    return col;
                });

                node.loading = false;
                node.columnsLoaded = true;
                this.setState({databases: state.databases});
            });
        }
    }

    mapTable = () => {
        let node = this.state.remoteCursor;
        if (node && node.iconType === "TABLE") {
          let data = {from: node.name,
            to: node.name,
            databaseName: node.parent.name
          };
          Client.mapTable(data, result => {
            window.notification.success("Success map table.");
            this.refreshDatabaseTree();
          })
        } else {
            window.notification.warning("Please select a table.");
        }
    };
    
    unmapTable = () => {
        let node = this.state.cursor;
        if (node && node.iconType === "TABLE") {
            let db = node.parent.name;
            if (db === 'default') {
                window.notification.warning("Cannot drop table in 'default' database.");
                return;
            }
            Client.unmapTable(node.parent.name, node.name, result => {
                window.notification.success("Success unmap table.");
                this.refreshDatabaseTree();
            })
        } else {
            window.notification.warning("Please select a table.");
        }
    };

    unmapDatabase = () => {
        let node = this.state.cursor;
        if (node && node.iconType === "DATABASE") {
            let db = node.name;
            if (db === 'default') {
                window.notification.warning("Cannot drop 'default' database.");
                return;
            }

            Client.unmapDatabase(node.name, result => {
                window.notification.success("Success unmap table.");
                this.refreshDatabaseTree();
            })
        } else {
            window.notification.warning("Please select a database.");
        }
    }

    render() {
        const { classes} = this.props;
        const {tab, loading} = this.state;

        const content = (
            <div>
                <div className={classes.toolbar}>
                    <Tooltip title="Map Database"><Button variant="fab" color="primary" aria-label="Add" mini className={classes.button} onClick={this.openConnectionDialog}>
                        <AddIcon />
                    </Button></Tooltip>
                    <Tooltip title="Unmap Database"><Button variant="fab" mini aria-label="Delete" className={classes.button} onClick={this.unmapDatabase}>
                        <DeleteIcon />
                    </Button></Tooltip>
                    <ConnectionDialog
                        open={this.state.popup}
                        onClose={this.closeConnectionDialog}
                    />
                </div>
                <div>
                    <AppBar position="static">
                        <Tabs value={tab} onChange={this.switchTab}>
                            <Tab label="Local" />
                            <Tab label="Remote" />
                        </Tabs>
                    </AppBar>

                    {tab === 0 && <TabContainer>
                        <div className={classes.tabToolbar}><Button variant="outlined" color="primary" size="small" className={classes.button} onClick={this.unmapTable}>
                            Unmap Table
                            </Button></div>
                        <div className={classes.wrapper}>
                            <Treebeard
                                data={this.state.databases}
                                onToggle={this.onToggle}
                                decorators={dec}
                                style={TreebeardStyle}
                            />
                            {loading && <CircularProgress size={48} className={classes.progress} />}
                        </div>
                    </TabContainer>}
                    {tab === 1 && <TabContainer>
                        <div className={classes.tabToolbar}><Button variant="outlined" color="primary" size="small" className={classes.button} onClick={this.mapTable}>
                            Map Table
                        </Button></div>
                        <div className={classes.wrapper}>
                            <Treebeard
                                data={this.state.remoteDatabases}
                                onToggle={this.onRemoteToggle}
                                decorators={dec}
                                style={TreebeardStyle}
                            />
                            {loading && <CircularProgress size={48} className={classes.progress} />}
                        </div>
                    </TabContainer>}
                </div>
            </div>
        );

        return <div>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={this.props.open}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    onClose={this.props.handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    anchor="left"
                    variant="permanent"
                    open
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                {content}
                </Drawer>
            </Hidden>
        </div>;
    };
}

TreeSidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(TreeSidebar);
