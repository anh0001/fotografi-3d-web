import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core'
import ModalVideo from 'react-modal-video'
import './style.scss'

// images 
import about from 'images/about.jpg'

const AboutContent = () => {
    const [open, setOpen] = useState(false)
    return (
        <Grid className="aboutArea">
            <Grid container spacing={4} className="container">
                <Grid item lg={6} md={6} xs={12}>
                    <Grid className="aboutContent">
                        <h2>About <span>3D Fotografi Nusantara</span></h2>
                        <p>Inovasi digital ekonomi kreatif melalui penyajian foto-foto dalam bentuk 3D. Menyediakan pengolahan foto produk 3D dan pencetakan 3D. Dapat diimplementasikan pada:</p>
                        <ul>
                            <li>3D e-commerce.</li>
                            <li>Custom wedding souvenir. </li>
                            <li>Duplikasi atau replikasi benda-benda bersejarah.</li>
                        </ul>
                    </Grid>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Grid style={{ background: `url(${about}) no-repeat center center / cover` }} className="aboutImg">
                        <Button
                            onClick={() => setOpen(true)}>
                            <i className="fa fa-play"></i>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <ModalVideo
                channel='youtube'
                isOpen={open}
                videoId='XOStXaZ25cw'
                onClose={() => setOpen(false)}
            />
        </Grid>
    )
}


export default AboutContent;
