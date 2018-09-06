import {
    drawerWidth,
    transition,
    boxShadow,
    button,
    progressColor
} from "assets/jss/material-dashboard-react.jsx";

const style = theme => ({
    drawerPaper: {
        border: "none",
        position: "fixed",
        top: "64px",
        bottom: "0",
        left: "0",
        zIndex: "1",
        ...boxShadow,
        width: drawerWidth,
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            position: "fixed",
            height: "100%"
        },
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
            ...boxShadow,
            position: "fixed",
            display: "block",
            top: "64px",
            height: "100vh - 64px",
            right: "0",
            left: "auto",
            zIndex: "1032",
            visibility: "visible",
            overflowY: "visible",
            borderTop: "none",
            textAlign: "left",
            paddingRight: "0px",
            paddingLeft: "0",
            transform: `translate3d(${drawerWidth}px, 0, 0)`,
            ...transition
        }
    },
    toolbar: {
        padding: "10px 20px"
    },
    tabToolbar: {
        paddingBottom: 10,
        paddingTop: 5
    },
    button: {
        marginRight: 10,
        ...button
    },
    wrapper: {
        position: 'relative',
    },
    progress: {
        color: progressColor,
        position: 'absolute',
        top: '20px',
        left: '30%',
      }
});

export default style;
