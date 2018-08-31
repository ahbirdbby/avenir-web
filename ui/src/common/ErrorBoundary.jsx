import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

const style = theme => ({});

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null , hasError: false};
    }
    
    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with error message
      this.setState({
        error: error,
        errorInfo: errorInfo,
        hasError: true
      })
      // You can also log error messages to an error reporting service here
    }
  
    handleClose = () => {
      this.setState({hasError: false});
    }
    
    render() {
      if (this.state.errorInfo) {
        // Error path
        return (
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.hasError}
            onClose={this.handleClose}
          >
            <SnackbarContent
              onClose={this.handleClose}
              variant="error"
              message={this.state.error.toString()}
            />
          </Snackbar>
        );
      }
      // Normally, just render children
      return this.props.children;
    }  
  }

  ErrorBoundary.propTypes = {
    classes: PropTypes.object.isRequired
  };
  
  export default withStyles(style)(ErrorBoundary);