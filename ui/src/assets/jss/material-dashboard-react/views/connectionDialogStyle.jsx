const style = theme => ({
    popup: {
      backgroundColor: '#eeeeee'
    },
    root: {
        minHeight: '450px',
        width: '450px'
    },
    group: {
        width: '400px',
        padding: '10px 10px'
    },
    loginForm: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    textField: {
        marginRight: theme.spacing.unit,
        width: 400,
      },
      portTextField: {
          width: 108,
          marginLeft: theme.spacing.unit * 4
      },
      hostTextField: {
        width: 250
    },
    divider: {
        margin: '10px 0px'
    },
    bootstrapRoot: {
        padding: 0,
        'label + &': {
          marginTop: theme.spacing.unit * 3,
        },
      },
      bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
      },
      bootstrapFormLabel: {
        fontSize: 18,
      }
});
export default style;