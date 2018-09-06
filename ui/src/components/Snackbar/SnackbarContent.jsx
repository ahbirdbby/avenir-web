import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Snack from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';
// core components


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const snackbarContentStyle = theme => ({
  root: {
    maxWidth: '100%'
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  hidden: {
    // visibility: 'hidden',
    // opacity: 0,  
    // transition: 'visibility 0s linear 0.33s, opacity 0.33s linear'
    display: 'none'
  }
});

class SnackbarContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {message: '', show: false, variant: props.variant};
  }

  error = ( msg) => {
    this.setState({message: 'Error: ' + msg, show: true, variant: 'error'});
  }

  success = (msg) => {
    this.setState({message: msg, show: true, variant: 'success'});
  }

  warning = msg => {
    this.setState({message: msg, show: true, variant: 'warning'});
  }

  show = (msg) => {
    this.setState({message: msg, show: true});
  }

  close = () => {
    let onClose = this.props.onClose;
    if (onClose) {
      onClose();
    }
    this.setState({message: '', show: false});
  }

  render() {
    const { classes, className, variant, ...other } = this.props;
    let realVariant = this.state.variant;
    const Icon = variantIcon[realVariant];

    return (
      <Snack
        className={classNames(classes[realVariant], classes.root, className, !this.state.show ? classes.hidden : '')}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {this.state.message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.close}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        // {...other}
      />
    );
  }
}

SnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  show: PropTypes.bool
};

SnackbarContent.defaultProps = {
  show: true
}

export default withStyles(snackbarContentStyle)(SnackbarContent);
