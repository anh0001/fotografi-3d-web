
import React from 'react';
import { injectIntl } from 'react-intl';
import messages from './messages';
import { Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import ScrollTop from 'components/ScrollTop/Loadable'

import './style.scss'

// images 
import logo from 'images/logo.png'

const Footer = (props) => {

    return (
        <footer className='footerArea bgGray'>
            <ScrollTop
                scrollStepInPx="50"
                delayInMs="16.66"
            />
            <Grid className="container" container spacing={4}>
                <Grid item xs={12}>
                    <Grid className="newsleter">
                        <h2>Follow kami</h2>
                        <form>
                            <input placeholder="Enter Your Email" type="text" />
                            <Button>Subscribe</Button>
                        </form>
                    </Grid>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Grid className="footerLogo">
                        <img src={logo} alt="" />
                        <p>Build your 3D products </p>
                        <ul className="socialMedia">
                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                            <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                            <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                        </ul>
                    </Grid>
                </Grid>
                <Grid item lg={3} md={2} sm={3} xs={12}>
                    <h3 className="footertitle">Resources</h3>
                    <ul className="footerMenus">
                        <li><Link to="/aghgh">Privacy Policy</Link></li>
                        <li><Link to="/aghgh">Terms & License</Link></li>
                        <li><Link to="/aghgh">Support Policy</Link></li>
                        <li><Link to="/aghgh">Refund Policy</Link></li>
                    </ul>
                </Grid>
                <Grid item lg={3} md={2} sm={3} xs={12}>
                    <h3 className="footertitle">Useful Links</h3>
                    <ul className="footerMenus">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/aghgh">Help Link</Link></li>
                        <li><Link to="/aghgh">Terms & Conditions</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </Grid>
                <Grid item lg={3} md={4} xs={12}>
                    <div className="footerEarningWrap">
                        <h3 className="footertitle">Market Earning</h3>
                        <p>inovasi model-model 3D</p>
                        <ul>
                            <li>
                                <span>Item Sold</span>
                                <h4>1</h4>
                            </li>
                            <li>
                                <span>Total Earning</span>
                                <h4>100000</h4>
                            </li>
                        </ul>
                    </div>

                </Grid>
                <Grid item xs={12} >
                    <p className="copyright">© 2022 3D-Fotografi-Nusantara. All rights reserved</p>
                </Grid>
            </Grid>
        </footer >
    );
}

export default injectIntl(Footer);
