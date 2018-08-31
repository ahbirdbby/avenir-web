import { successColor,  
  drawerWidth,
  transition} from "assets/jss/material-dashboard-react.jsx";

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
  }
});

export default dashboardStyle;
