import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Container} from "@material-ui/core";
import {YearFilterPanel} from "./components/YearFilterPanel";
import {TabPanel} from "./components/TabPanel";
import {DetailCard} from "./components/DetailCard";


const useStyles = makeStyles(theme => {
    return ({
        root: {
            backgroundColor: "transparent",
            textAlign: 'center',
            position: 'absolute',
            zIndex: 2,
            margin: '5em 2em',
            maxWidth: '50%'
        },
        item_1: {
            textAlign: 'right',
        },
        item_2: {
            textAlign: 'left'
        },
        title: {
            fontFamily: 'Open Sans',
            fontSize: '42px',
            color: theme.palette.grey['500']
        },
        titlePaper: {
            backgroundColor: 'transparent',
            color: '#fff',
        },
        titleFont: {
            fontFamily: 'Ubuntu',
            fontWeight: "light",
        },
        totalDeathNum: {
            backgroundColor: '#fff',
            color: '#000',
            fontFamily: 'Ubuntu',
            fontWeight: 'bold',
            textAlign: 'right',
            marginLeft: '2em',
            fontSize: 'x-large'
        },
        totalDeathText: {
            fontFamily: 'Ubuntu',
            fontWeight: 'bold',
            fontSize: 'large'
        },
        detailCard: {
            marginTop: '12em'
        }
    });
})

const GeoSyriaUI = (props) => {

    const classes = useStyles();

    return (<Container className={classes.root}>
            <Grid container spacing={0}>

                <Grid item className={classes.item_1} sm='auto' md='auto'>
                    <Grid item md={11}>
                        <Paper elevation={0} className={classes.titlePaper}>
                            <Typography component='div' className={classes.totalDeathNum}>
                                {props.total && <span>{props.total.toLocaleString()}</span>}
                            </Typography>
                        </Paper>
                        <Grid>
                            <YearFilterPanel {...props}/>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item className={classes.item_2} sm='auto' md={5}>
                    <Paper elevation={0} className={classes.titlePaper}>
                        <Typography className={classes.totalDeathText}>
                            <span>Total deaths</span>
                        </Typography>
                    </Paper>
                    <Paper elevation={0} className={classes.titlePaper}>
                        <Typography className={classes.title}>
                            <span>Syrian Civil War</span>
                        </Typography>
                        <Typography style={{fontFamily: 'Open Sans', fontWeight: 'normal', fontSize: 'x-large', color: '#6c6c6c'}}>
                            2016-2019
                        </Typography>
                    </Paper>
                    <Paper elevation={0}>
                        {props.filter && <TabPanel
                            coordinate={props.filter}
                            getDetail={props.getDetail}
                            cleanDetail={props.cleanDetail}
                            details={props.details || {_id: ''}}
                            checked={!!props.filter}
                        />}
                    </Paper>
                </Grid>

                {props.details && <Grid item md={4} className={classes.detailCard}>
                    <DetailCard details={props.details} />
                </Grid>}

            </Grid>

        </Container>
    );
}

export default GeoSyriaUI;
