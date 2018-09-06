import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
// core components
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

import style from "assets/jss/material-dashboard-react/views/connectionDialogStyle.jsx";

const databases = [
    { value: 'PostgreSQL', label: 'PostgreSQL' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'Oracle', label: 'Oracle' },
    { value: 'SQLServer', label: 'SQL Server' },
    { value: 'DB2', label: 'DB2' },
    { value: 'SQLAzure', label: 'SQLAzure' },
    { value: 'FileMaker', label: 'FileMaker' },
    { value: 'MariaDB', label: 'MariaDB' }
  ];

const errorObj = {
    host: false,
    port: false,
    user: false,
    password: false,
    schema: false
};

class ConnectionDialog extends React.Component {

    constructor(props) {
      super(props);

      this.state.database = {type: null, port: 0};
      this.state.tabIndex = 0;
      this.state.errorObj = errorObj;
    }
  
    state = {};
  
    // TODO
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.value !== this.props.value) {
    //     this.setState({ value: nextProps.value });
    //   }
    // }
  
    handleCancel = () => {       
      this.props.onClose();
    };
  
    handleOk = () => {  
        if (this.state.database.type == null) {
            this.snack.show("Please select a kind of database.");
            return;
        }
        let err = this.state.errorObj;
        let valid = true;   
        let db = this.state.database;
        Object.keys(err).forEach(function (key) {
            if (err[key] || db[key] === undefined) {
                valid = false;
            }
        })

        if (!valid) {
            this.snack.show("The field with start sign CANNOT be empty.");
            return;
        }
        if (this.state.database.id != null) {
            const db = this.state.database;
            db.id = null;
            this.setState({database: db});
        }
      this.props.onClose(this.state.database);
    };

    selectDatabase = value => {
        this.setState(prev => ({database: {
            ...prev.database,
            type: value}}));
    }

    selectTab = (event, value) => {
        this.setState({ tabIndex: value });
    };

    handleChange = name => event => {
        let err = this.state.errorObj;
        Object.keys(err).forEach(function (key) {
            err[key] = false;
        })
        this.setState({errorObj: err});

        let val = event.target.value;
        
        if (Object.keys(this.state.errorObj).includes(name) && val.trim() === '') {
                err[name] = true;
                this.setState({errorObj: err});
        }
        let database = {...this.state.database,
            [name]: val
        }
        event.target.error = true;
        this.setState({database: database});
    };

    handleEnter = () => {
        if (this.props.value.host === undefined) {
            this.setState({database: {type: null, host: '', port: 0, user: '', password: '', schema: '', toSchema: ''}});
        } else {
            this.setState({database: this.props.value});
        }
    };
  
    render() {
      const { classes, ...other } = this.props;
      const {database:db} = this.state;
      let title = db.id === undefined ? "Map Database" : "Map Database";
  
      return (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="md"
          aria-labelledby="confirmation-dialog-title"
          classes={{paper: classes.popup}}
        //   onEnter={this.handleEnter}
          {...other}
        >
          <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
          <DialogContent>
                  <div className={classes.root}>
                      <Grid container>
                          <Grid item xs={12}>
                              <SnackbarContent
                                  variant="error"
                                  innerRef={(el) => {this.snack = el}}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <div className={classes.group}>
                                 <div>Groups:</div>
                                  <div>
                                      <Select
                                          value={this.state.database.type}
                                          onChange={this.selectDatabase}
                                          options={databases}
                                      />
                                  </div>
                              </div>
                          </Grid>
                          <Grid item xs={12}>
                              <Tabs value={this.state.tabIndex} onChange={this.selectTab}>
                                  <Tab label="Login" />
                                  <Tab label="Advanced" />
                              </Tabs>
                              {this.state.tabIndex === 0 && <div>
                                  <div className={classes.loginForm} noValidate autoComplete="off">
                                      <TextField
                                          id="host"
                                          label="Host"
                                          required
                                          error={this.state.errorObj.host}
                                          className={classes.hostTextField}
                                          value={this.state.database.host}
                                          onChange={this.handleChange('host')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="port"
                                          label="Port"
                                          type="number"
                                          required
                                          error={this.state.errorObj.port}
                                          className={classes.portTextField}
                                          value={this.state.database.port}
                                          onChange={this.handleChange('port')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="user"
                                          label="User"
                                          required
                                          error={this.state.errorObj.user}
                                          className={classes.textField}
                                          value={this.state.database.user}
                                          onChange={this.handleChange('user')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="password"
                                          label="Password"
                                          required
                                          error={this.state.errorObj.password}
                                          type="password"
                                          className={classes.textField}
                                          value={this.state.database.password}
                                          onChange={this.handleChange('password')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="database"
                                          label="Database"
                                          required
                                          error={this.state.errorObj.database}
                                          className={classes.textField}
                                          value={this.state.database.schema}
                                          onChange={this.handleChange('schema')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="toDatabase"
                                          label="Local Database"
                                          className={classes.textField}
                                          value={this.state.database.toSchema}
                                          onChange={this.handleChange('toSchema')}
                                          margin="dense"
                                      />
                                  </div>
                                  {/* <Divider light className={classes.divider}/> */}
                                  <div>
                                      <Typography variant="subheading">
                                          Connection String Preview
                                      </Typography>
                                      <Typography variant="body2">
                                          jdbc:{db.type == null ? '' : db.type.value}://{db.host}:{db.port}
                                      </Typography>
                                  </div>
                              </div>}
                              {this.state.tabIndex === 1 && <div>
                                  </div>}
                          </Grid>
                      </Grid>
                  </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleOk} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }

  ConnectionDialog.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  export default withStyles(style)(ConnectionDialog);