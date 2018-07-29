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
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import style from "assets/jss/material-dashboard-react/views/connectionDialogStyle.jsx";

const databases = [
    { value: 'GENERIC', label: 'Generic' },
    { value: 'MYSQL', label: 'MySQL' },
    { value: 'ORACLE', label: 'Oracle' },
    { value: 'SQL_SERVER', label: 'SQL Server' }
  ];

class ConnectionDialog extends React.Component {

    constructor(props) {
      super(props);

      this.state.database = {type: null, port: 0};
      this.state.tabIndex = 0;
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
        let database = {...this.state.database,
            [name]: event.target.value
        }
        this.setState({database: database});
    };

    handleEnter = () => {
        if (this.props.value.host === undefined) {
            this.setState({database: {type: null, host: '', port: 0, user: '', password: '', schema: ''}});
        } else {
            this.setState({database: this.props.value});
        }
    }
  
    render() {
      const { classes, ...other } = this.props;
      const {database:db} = this.state;
      let title = db.id === undefined ? "New Connection" : "Edit Connection";
  
      return (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="md"
          aria-labelledby="confirmation-dialog-title"
          onEnter={this.handleEnter}
          {...other}
        >
          <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
          <DialogContent>
                  <div className={classes.root}>
                      <Grid container>
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
                                          className={classes.portTextField}
                                          value={this.state.database.port}
                                          onChange={this.handleChange('port')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="user"
                                          label="User"
                                          required
                                          className={classes.textField}
                                          value={this.state.database.user}
                                          onChange={this.handleChange('user')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="password"
                                          label="Password"
                                          required
                                          type="password"
                                          className={classes.textField}
                                          value={this.state.database.password}
                                          onChange={this.handleChange('password')}
                                          margin="dense"
                                      />
                                      <TextField
                                          id="database"
                                          label="Database"
                                          className={classes.textField}
                                          value={this.state.database.schema}
                                          onChange={this.handleChange('schema')}
                                          margin="dense"
                                      />
                                  </div>
                                  <Divider light className={classes.divider}/>
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
                                  Item Two</div>}
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