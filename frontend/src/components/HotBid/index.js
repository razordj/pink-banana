import React from "react";
import cn from "classnames";
import Slider from "react-slick";
import styles from "./HotBid.module.sass";
import Icon from "../Icon";
import Card from "../Card";


import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { connect } from "react-redux";
import { getUploadedNFTs } from '../../store/actions/upload';

// data
import { bids } from "../../mocks/bids";

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);


const Hot = ({ classSection, uploadedNfts }) => {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: (
      <SlickArrow>
        <Icon name="arrow-next" size="14" />
      </SlickArrow>
    ),
    prevArrow: (
      <SlickArrow>
        <Icon name="arrow-prev" size="14" />
      </SlickArrow>
    ),
    responsive: [
      {
        breakpoint: 1179,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          infinite: true,
        },
      },
    ],
  };

  const dispatch = useDispatch();
  useEffect(() => {
    getUploadedNFTs()(dispatch);

  }, [])


  return (
    <div className={cn(classSection, styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrapper}>
          <h3 className={cn("h3", styles.title)}>Hot bid</h3>
          <div className={styles.inner}>
            <Slider className="bid-slider" {...settings}>
              {bids.map((x, index) => (
                <Card key={index} className={styles.card} item={x} />
              ))}
            </Slider>
            {/* <Slider className="bid-slider" {...settings}>
              {uploadedNfts.map((x, index) => (
                <Card key={index} className={styles.card} item={x} />
              ))}
            </Slider> */}
          </div>
        </div>
      </div>
    </div>
  );
};

//export default Hot;


const mapToStateProps = ({ uploading }) => ({
  uploadedNfts: uploading.uploadedNfts
});

const mapToDispatchProps = (dispatch) => ({
  getUploadedNFTs: (payload) => dispatch(getUploadedNFTs(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Hot);

