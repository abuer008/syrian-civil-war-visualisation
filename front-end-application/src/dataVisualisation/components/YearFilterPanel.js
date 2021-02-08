import React, {useState} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {makeStyles} from "@material-ui/core/styles";
import {DATA_TYPES} from "../data/Types";

const useStyles = makeStyles(theme => ({
    root: {
        margin: '10rem 0',
        height: 'inherit',
    },
    panel: {
        backgroundColor: 'transparent',
        color: theme.palette.grey['400'],
        verticalAlign: 'middle'
    },
    tab: {
        fontFamily: 'Ubuntu',
        fontSize: 'large',
    }
}))


export const YearFilterPanel = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState('');

    const YTab = props => <Tab
        {...props}
        disableRipple
        className={classes.tab} />;

    const filter = (param) => {
        return props.coordinate.filter(item => item.year === parseInt(param));
    }


    const handleYear = (e, newValue) => {
        setValue(newValue);
        props.filter_param === e.target.innerHTML ? props.filterData(DATA_TYPES.FILTER, null) : props.filterData(DATA_TYPES.FILTER, filter(e.target.innerHTML), e.target.innerHTML);
        props.cleanDetail(DATA_TYPES.DETAILS)
        props.getTotal(DATA_TYPES.SUM, {year: e.target.innerHTML});
        console.log(e.target.innerHTML);
    }
    return (<div className={classes.root}>
        <Tabs orientation='vertical'
              value={value}
              onChange={handleYear}
              className={classes.panel}
              indicatorColor='secondary'
        >
            <YTab label='2016'/>
            <YTab label='2017'/>
            <YTab label='2018'/>
            <YTab label='2019'/>
        </Tabs>
    </div>);
}
