'use strict';

export default {
    tree: {
        base: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                padding: '0px 5px',
                display: 'flex'
            },
            activeLink: {
                backgroundColor: 'lightgray'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 24,
                width: 24,
                arrow: {
                    fill: '#9DA5AB',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'flex',
                    verticalAlign: 'middle',
                    // color: '#9DA5AB',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: '24px'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle',
                    display: 'block'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};