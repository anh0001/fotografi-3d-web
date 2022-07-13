import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Button } from '@material-ui/core'
import ModalVideo from 'react-modal-video'
import './style.scss'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// images 
import bgImg from 'images/bg/hero.png'
import heroImg from 'images/hero-img.png'

const heros = {
    title: 'The Best Template To Create Your',
    titleColor: 'Digital Marketplace',
    text: 'We make selling digital products a breeze. Easy Digital Downloads is simple to use and free to download.',
    btn: 'Explore Templates',
    btn2: 'Get Started Now',
    bg: bgImg,
    heroImg: heroImg
}

const Hero = (props) => {
    const [open, setOpen] = useState(false)

    return (
        <Grid
            style={{ background: `url(${heros.bg}) no-repeat center center / cover` }}
            className="heroArea">
            <Grid
                container
                spacing={4}
                alignItems="center"
                className="container">
                <Grid item lg={7} md={7}>
                    <Grid className="heroContent">
                        <h2>{heros.title} <span>{heros.titleColor}</span></h2>
                        <p>{heros.text}</p>
                        <ul>
                            <li><Button className="btn">{heros.btn}</Button></li>
                            <li><Button className="btn btnNormal">{heros.btn2}</Button></li>
                        </ul>
                    </Grid>
                </Grid>
            </Grid>
            <Grid className="heroImg">
                {/* <img src={heros.heroImg} alt="" /> */}
                <div class="sketchfab-embed-wrapper"> <iframe width="500px" height="500px" title="Dirty Car - Cadillac 75 Sedan 1953" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/17367b2c31f048eea3144f5a8c55165f/embed"> </iframe></div>
                
            </Grid>
            <ModalVideo
                channel='youtube'
                isOpen={open}
                videoId='XOStXaZ25cw'
                onClose={() => setOpen(false)}
            />
        </Grid>
    );
}

export default injectIntl(Hero);