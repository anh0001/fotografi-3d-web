import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core'
import './style.scss'

const purchases = [
    {
        name: 'Single Use',
        old_price: '$69',
        price: '$29',
        id: 1
    },
    {
        name: '5 Site Use',
        old_price: '$99',
        price: '$59',
        id: 2
    },
    {
        name: 'Multi Use',
        old_price: '$299',
        price: '$149',
        id: 3
    },
]

const PurchaseLicence = () => {
    const [value, setValue] = useState(1);
    return (
        <Grid className="widgetWrap purchaseLicenceWrap">
            <h3><i className="fi flaticon-bag"></i> Purchase a Licence</h3>
            <ul className="purchaseLicenceList">
                {purchases.map((item, i) => (
                    <li key={i}>
                        <Button onClick={() => setValue(item.id)} className={value === item.id ? 'active' : ''}>
                            <span>{item.name}</span>
                            <del>{item.old_price}</del>
                            <h4>{item.price}</h4>
                        </Button>
                    </li>
                ))}
            </ul>
            {value === 1 && <Grid className="purchaseLicenceContent">
                <p>The purchase entitles you to 1 years updates and product support. </p>
                <ul>
                    <li>Quality checked by Edefy.</li>
                    <li>Yearly Future updates</li>
                    <li>6 months support from Author</li>
                </ul>
            </Grid>}
            {value === 2 && <Grid className="purchaseLicenceContent">
                <p>The purchase entitles you to 5 years updates and product support. </p>
                <ul>
                    <li>Quality checked by Edefy.</li>
                    <li>Yearly Future updates</li>
                    <li>Quality checked by Edefy.</li>
                    <li>2 years support from Author</li>
                </ul>
            </Grid>}
            {value === 3 && <Grid className="purchaseLicenceContent">
                <p>The purchase entitles you to 20 years updates and product support. </p>
                <ul>
                    <li>Quality checked by Edefy.</li>
                    <li>Yearly Future updates</li>
                    <li>Quality checked by Edefy.</li>
                    <li>5 Years support from Author</li>
                </ul>
            </Grid>}
            <div className="textCenter">
                <Button className="btn mb-25">Purchase Now</Button> <br />
                <Button component="a" href="Javascript:void(0)" className="btn btnNormal">Live Preview</Button>
            </div>
        </Grid>
    )
}

export default PurchaseLicence;
