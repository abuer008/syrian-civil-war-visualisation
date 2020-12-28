import React from "react";
import Grid from "@material-ui/core/Grid";
import Chip from '@material-ui/core/Chip';
import Grow from "@material-ui/core/Grow";
import {makeStyles} from "@material-ui/core/styles";
import {DATA_TYPES} from "../data/Types";

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.common.black,
        flexGrow: 1,
        fontFamily: 'Ubuntu',
        margin: '5em 0'
    },
    paper: {
        opacity: 1,
        height: '30em',
        overflow: 'hidden'
    },
    chip: {
        fontSize: "medium",
        fontWeight: "bolder",
        color: theme.palette.grey['700'],
    }
}))

export const TabPanel = ({coordinate, getDetail, cleanDetail, details, checked}) => {
    const classes = useStyles();
    const handleClick = id => {
        details._id === id ? cleanDetail(DATA_TYPES.DETAILS) : getDetail(DATA_TYPES.DETAILS, {id});
    }

    return (<div className={classes.root}>
        <Grid container spacing={1} justify='space-evenly' className={classes.paper} md={8}>
            {coordinate &&
            coordinate.slice(0, 30).map(item => {
                let index = coordinate.indexOf(item);
                return <Grid item key={item._id}>
                    <Grow in={checked}
                          style={{transformOrigin: '0 0 0'}}
                          {...(checked ? {timeout: index * 40} : {})}>
                        <Chip className={classes.chip}
                              variant={details._id === item._id ? 'default' : 'outlined'}
                              onClick={() => {handleClick(item._id)}}
                              label={item.deaths_num}
                        />
                    </Grow>
                </Grid>;})}
        </Grid>
    </div>);
}
