import React, { Fragment, Component } from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Button, TextField, InputAdornment } from '@material-ui/core'
import Swiper from 'react-id-swiper';
import { Link } from 'react-router-dom'
import ModalVideo from 'react-modal-video'

// components 
import Header from 'components/Header/Loadable'
import Breadcumb from 'components/Breadcumb/Loadable'
import Pagination from 'components/Pagination'
import CategoryList from 'components/CategoryList/Loadable'
import RecentPost from 'components/RecentPost/Loadable'
import Quote from 'components/Quote/Loadable'
import Tags from 'components/Tags/Loadable'
import Footer from 'components/Footer/Loadable'
import './style.scss'

// images 
import logo from 'images/logo.png'
import image1 from 'images/blogs/img4.jpg'
import image2 from 'images/blogs/img5.jpg'
import image3 from 'images/blogs/img6.jpg'
import avarar1 from 'images/blogs/avatar1.png'
import avarar2 from 'images/blogs/avatar2.png'
import avarar3 from 'images/blogs/avatar3.png'

const menus = [
    {
        name: 'Home',
        link: '/'
    },
    {
        name: 'Katalog',
    },
]



const katalogs = [
    {
        title: "Caesar statue cultural heritage using scanner",
        date: 'Jul 7,2022',
        author_name: '3d-fotografi-nusantara',
        author: avarar1,
        like: '34',
        details: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now.",
        model3d: "https://sketchfab.com/models/f9b5ffe3851b4424a0822149626a0010/embed",
        id: 1
    },
    {
        title: 'Buddha heritage scanned with background blurring',
        date: 'Jul 14,2022',
        author_name: '3d-fotografi-nusantara',
        author: avarar3,
        like: '147',
        details: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now.",
        model3d: "https://sketchfab.com/models/3c950580306442759ba97bae868383d4/embed",
        id: 2,
    },
    {
        title: 'Wisnu statue cultural heritage from scanner',
        date: 'Jul 14,2022',
        author_name: '3d-fotografi-nusantara',
        author: avarar2,
        like: '75',
        details: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now.",
        model3d: "https://sketchfab.com/models/d1ac53a6e7d845b8a9b2d8af92332f32/embed",
        id: 3,
    },

    {
        title: 'Brown boot from scanner',
        date: 'Jul 14,2022',
        author_name: '3d-fotografi-nusantara',
        author: avarar3,
        like: '785',
        details: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now.",
        model3d: "https://sketchfab.com/models/ad8d35ce73564d2ca3c94fe8a8b23d5b/embed",
        id: 4,
    },
    {
        title: 'Kids shoes',
        date: 'Jul 14,2022',
        author_name: '3d-fotografi-nusantara',
        author: avarar1,
        like: '34',
        details: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now.",
        model3d: "https://sketchfab.com/models/9454424987bf45eb9bf7290823ca0cf1/embed",
        id: 5
    },

    {
        title: 'Chuck from scanner',
        date: 'Jul 14,2022',
        author_name: '3d-fotografi-nusantara',
        author: avarar3,
        like: '785',
        details: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now.",
        model3d: "https://sketchfab.com/models/17367b2c31f048eea3144f5a8c55165f/embed",
        id: 6,
    },
]

const searchingFor = search => katalog =>
    katalog.title.toLowerCase().includes(search.toLowerCase()) || !search;
class Katalog extends Component {
    state = {
        pageOfItems: [],
        search: '',
        open: false
    }
    changeHandler = (e) => {
        this.setState({
            search: e.target.value
        })
    }


    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    }
    render() {
        const params = {
            speed: 600,
            parallax: true,
            parallaxEl: {
                el: '.parallax-bg',
                value: '-23%'
            },
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        }
        return (
            <Fragment>
                <Helmet>
                    <title>Katalog</title>
                </Helmet>
                <Header
                    className="headerAreaStyleTwo"
                    logo={logo}
                />
                <Breadcumb
                    title="Katalog"
                    menus={menus}
                />
                <Grid className="blogPageArea ptb-104">
                    <Grid container className="container" spacing={4}>
                        <Grid item md={8} xs={12}>
                            {this.state.pageOfItems.filter(searchingFor(this.state.search)).map((katalog, i) => (
                                <Grid key={i} className={katalog.image || katalog.slider || katalog.video ? 'blogGridWrap' : 'blogGridWrap blogGridWrapStyleTwo'}>
                                    {katalog.image && <Grid className="blogGridImg">
                                        <img src={katalog.image} alt="" />
                                    </Grid>}
                                    {katalog.video && <Grid className="blogGridVideo">
                                        <img src={katalog.video} alt="" />
                                        <Button
                                            onClick={() => this.setState({ open: true })}>
                                            <i className="fa fa-play"></i>
                                        </Button>
                                    </Grid>}
                                    {katalog.slider && <Grid className="blogGridSlider">
                                        <Swiper {...params}>
                                            {katalog.slider.map((item, i) => (
                                                <img key={i} src={item} alt="" />
                                            ))}
                                        </Swiper>
                                    </Grid>}
                                    {katalog.model3d && <Grid className="blogGridImg">
                                        <iframe width="750px" height="500px" title={katalog.title}
                                                frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" 
                                                allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share
                                                src={katalog.model3d}>
                                        </iframe>
                                    </Grid>}
                                    <Grid className="blogGridContent">
                                        <ul className="blogGridMeta">
                                            <li><img src={katalog.author} alt="" /> By <Link to="/author">{katalog.author_name}</Link></li>
                                            <li><i className="fi flaticon-calendar"></i> {katalog.date}</li>
                                            <li><i className="flaticon-heart-2"></i> {katalog.like}</li>
                                        </ul>
                                        <h3><Link to={`/blog-details/${katalog.id}`}>{katalog.title}</Link></h3>
                                        <p>{katalog.details}</p>
                                        <Link className="readmore" to={`/blog-details/${katalog.id}`}>Read More...</Link>
                                    </Grid>
                                </Grid>
                            ))}
                            <Pagination
                                rowShow={4}
                                items={katalogs}
                                onChangePage={this.onChangePage}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <aside className="blogSlidebar">
                                <TextField
                                    variant="outlined"
                                    value={this.state.search}
                                    fullWidth
                                    placeholder="Search..."
                                    className="searchField"
                                    onChange={this.changeHandler}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <Button><i className="ti-search"></i></Button>
                                        </InputAdornment>,
                                    }}
                                />
                                <CategoryList className="blogCategory" />
                                <RecentPost />
                                <Quote />
                                <Tags />
                            </aside>
                        </Grid>
                    </Grid>
                </Grid>
                <Footer />
                <ModalVideo
                    channel='youtube'
                    isOpen={this.state.open}
                    videoId='XOStXaZ25cw'
                    onClose={() => this.setState({ open: false })}
                />
            </Fragment>
        )
    }
}

export default Katalog;
