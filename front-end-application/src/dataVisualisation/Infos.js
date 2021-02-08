import React from "react";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import MLogoData from "../mLogo.svg";
import NLogoData from '../NameLogo.svg';
import RLogoData from '../datavisual_sourceLogo.svg';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: '1em',
        right: '2em',
        zIndex: 3,
    },
    logo: {
        padding: '0.5rem'
    }
}))

const MLogo = (props) =>
    <Link href='https://en.muthesius-kunsthochschule.de/' color='inherit'>
        <Icon {...props}>
            <img src={MLogoData} alt='muthesius kunsthochschule'/>
        </Icon>
    </Link>;


const NLogo = props =>
    <Link href='https://boweisdesign.com/' color='inherit'>
        <Icon {...props}>
            <img src={NLogoData} alt='bowei home page'/>
        </Icon>
    </Link>;

const RLogo = props =>
    <Link href='https://www.pcr.uu.se/research/ucdp/' color='inherit'>
        <Icon {...props}>
            <img src={RLogoData} alt='UCDP'/>
        </Icon>
    </Link>;

export default function Infos() {
    const classes = useStyles()
    return (<div className={classes.root}>
        <Grid container >
            <Grid item className={classes.logo}><MLogo/></Grid>
            <Grid item className={classes.logo}><NLogo/></Grid>
            <Grid item className={classes.logo}><RLogo/></Grid>
        </Grid>
    </div>);
}
