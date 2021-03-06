import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Grid } from '@material-ui/core'
import CountUp from 'react-countup';
import './style.scss'
const Activity = ({ className }) => {

    const activitys = [
        {
            icon: 'flaticon-network',
            title: 'Amazing Products',
            value: 2025,
            className: 'product',
            id: 1
        },
        {
            icon: 'flaticon-download',
            title: 'Total Downloads',
            className: 'download',
            value: 630168,
            id: 2
        },
        {
            icon: 'flaticon-emoji',
            title: 'Happy Customers',
            className: 'customer',
            value: 35620,
            id: 3
        },
        {
            icon: 'flaticon-team',
            title: 'Team Members',
            className: 'member',
            value: 100,
            id: 4
        },
    ]

    return (
        <Grid className={`activityArea bgGray ${className}`}>
            <Grid className="container"
                container
                spacing={4}>
                {activitys.map(item => (
                    <Grid
                        key={item.id}
                        item
                        lg={3}
                        sm={6}
                        xs={12}>
                        <div
                            className={`activityItem ${item.className}`}>
                            <i className={item.icon}></i>
                            <h4>
                                <CountUp
                                    className="customCount"
                                    start={0}
                                    end={item.value}
                                    duration={5}
                                    useEasing={true}
                                />
                                <span>+</span>
                            </h4>

                            <p>{item.title}</p>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}

export default Activity;
