import React from 'react';
import { Grid } from '@material-ui/core'
import Slider from "react-slick";
import SectionTitle from 'components/SectionTitle/Loadable'
import SingleTeam from 'components/SingleTeam/Loadable'
import './style.scss'

// images 
import martianda_foto from 'images/team/martianda_foto.jpg'
import anhar_foto from 'images/team/anhar_foto.jpg'
import team3 from 'images/team/img3.jpg'
import team4 from 'images/team/img4.jpg'
import lutfi_foto from 'images/team/lutfi_foto.jpg'
import ratri_foto from 'images/team/ratri_foto.jpg'

const teams = [
    {
        image: martianda_foto,
        name: 'Martianda Erste Anggraeni',
        desig: 'Ketua',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin'],
        id: 1
    },
    {
        image: anhar_foto,
        name: 'Anhar Risnumawan',
        desig: 'Anggota',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin', 'fa-youtube'],
        id: 2
    },
    {
        image: team3,
        name: 'Muhammad Gibran',
        desig: 'Anggota',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin'],
        id: 3
    },
    {
        image: team4,
        name: 'Nurul Istiqomah Budianti',
        desig: 'Anggota',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin', 'fa-youtube'],
        id: 4
    },
    {
        image: team3,
        name: 'Bening Safitri',
        desig: 'Anggota',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin'],
        id: 5
    },
    {
        image: lutfi_foto,
        name: 'Lutfi Hidayati',
        desig: 'Teknisi',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin', 'fa-youtube'],
        id: 6
    },
    {
        image: ratri_foto,
        name: 'Aestatica Ratri',
        desig: 'Teknisi',
        social: ['fa-facebook', 'fa-twitter', 'fa-linkedin'],
        id: 7
    },
]

const Team = () => {
    const settings = {
        infinite: true,
        slidesToShow: 5,
        speed: 500,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
        ]
    };
    return (
        <Grid className="teamArea ptb-104">
            <Grid
                container
                spacing={4}
                className="container">
                <Grid item xs={12}>
                    <SectionTitle
                        title='Our Team'
                        subtitle='Build your 3D products'
                    />
                </Grid>
                <Grid xs={12} item>
                    <Slider
                        className="teamSliderWrap"
                        {...settings}>
                        {teams.map((item, i) => (
                            <Grid key={i} className="teamWrap">
                                <SingleTeam
                                    image={item.image}
                                    name={item.name}
                                    designation={item.desig}
                                    social={item.social}
                                />
                            </Grid>
                        ))}

                    </Slider>
                </Grid>

            </Grid>
        </Grid >
    );
}

export default Team
