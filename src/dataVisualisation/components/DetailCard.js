import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useCardStyles = makeStyles(theme => ({
    root: {
        maxWidth: 'auto',
    },
    card: {
        backgroundColor: theme.palette.grey['900'],
        opacity: 0.8,
        color: theme.palette.common.white,
    },
    cardHeader: {
        fontFamily: 'Ubuntu',
        fontWeight: 'bold',
        fontSize: 'larger',
        textAlign: 'left'
    },
    subHeader: {
        fontFamily: 'Ubuntu',
        fontWeight: 'light',
        fontSize: 'medium',
        textAlign: 'left',
        color: theme.palette.grey['300']
    },
    content: {
        textAlign: 'left',
        fontFamily: 'Open Sans',
        paddingBottom: '2em'
    },
    footer: {
        borderTop: ' 1px solid',
        borderColor: theme.palette.grey['200'],
        textAlign: 'left',
        fontFamily: 'Ubuntu',
        fontWeight: 'normal'
    }
}))

export const DetailCard = ({details}) => {
    const classes = useCardStyles();
    const [shortText, setShortText] = useState('');

    const hideLongText = (text) => {
        let wordArray = text.split(' ');
        if (wordArray.length >= 30) {
            setShortText(wordArray.slice(0, 30).join(' ') + '...')
        } else {
            setShortText(wordArray.join(' '))
        }
    }

    useEffect(() => {
        hideLongText(details.source_headline);
    })

    return (<Grid>
        <Card raised className={classes.card}>
            <CardHeader title={`${details.high} deaths`}
                        subheader={`in ${details.where_coordinates}`}
                        classes={{title: classes.cardHeader, subheader: classes.subHeader}}/>
            <CardContent>
                <Typography className={classes.content}>{shortText}</Typography>
                <Typography className={classes.footer}>
                    {`from ${details.date_start} until ${details.date_end}`}
                </Typography>
            </CardContent>
        </Card>
    </Grid>);
}
