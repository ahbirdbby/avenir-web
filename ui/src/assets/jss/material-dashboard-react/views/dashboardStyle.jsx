import {
  drawerWidth,
  transition,
  progressColor
} from "assets/jss/material-dashboard-react.jsx";

const dashboardStyle = theme => ({
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch"
  },
  content: {
    padding: "30px 15px",
    minHeight: "calc(100vh - 123px)"
  },
  button: {
    margin: theme.spacing.unit
  },
  wrapper: {
    position: 'relative',
  },
  fabProgress: {
    color: progressColor,
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  buttonProgress: {
    color: progressColor,
    position: 'absolute',
    top: '14px',
    marginLeft: -80,
  }
});

export default dashboardStyle;
