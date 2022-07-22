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
    title: '3D Fotografi',
    titleColor: 'Nusantara',
    text: 'Inovasi digital ekonomi kreatif melalui penyajian foto dalam bentuk 3D. Menyediakan pengolahan foto produk 3D dan pencetakan 3D. Dapat diimplementasikan pada 3D e-commerce, custom wedding souvenir, dan duplikasi replikasi benda bersejarah.',
    btn: 'Katalog',
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
                            <li><Button to={`/blog`} className="btn" >{heros.btn}</Button></li>
                            {/* <li><Button className="btn btnNormal">{heros.btn2}</Button></li> */}
                        </ul>
                    </Grid>
                </Grid>
            </Grid>
            <Grid className="heroImg">
                {/* <img src={heros.heroImg} alt="" /> */}
                <div class="sketchfab-embed-wrapper">
                    <iframe width="500px" height="500px" title="Kids Shoes" frameborder="0" 
                            allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" 
                            xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share 
                            src="https://sketchfab.com/models/9454424987bf45eb9bf7290823ca0cf1/embed">
                    </iframe>
                </div>
                
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