import React, { useEffect, useState } from "react";
import cn from "classnames";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import styles from "./MarketCollections.module.sass";
import Icon from "../../../components/Icon";
import PhotoNFTData from "../../../ABI/PhotoNFTData.json";
import Web3Init from "../../../components/InitWeb3";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { collectinNames, getAllCollectData, viewCollectData } from "../../utils";
const dispatch = useDispatch;

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const UserCollection = () => {

  const [collectItems, setCollectItems] = useState([]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
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
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(async () => {
    const collectData = await getAllCollectData();
    // setFilterItems(collectData);
    const viewData = viewCollectData(collectData);
    setCollectItems(viewData);
    // const web3 = await Web3Init();
    // const accounts = await web3.eth.getAccounts();
    // const networkId = await web3.eth.net.getId();
    // if (PhotoNFTData.networks) {
    //   const deployedNetwork = PhotoNFTData.networks[networkId.toString()];
    //   const photoNFTData = new web3.eth.Contract(
    //     PhotoNFTData.abi,
    //     deployedNetwork && deployedNetwork.address
    //   );
    //   if (deployedNetwork) {
    //     // const ItemData = await photoNFTData.methods.getPhotoByNFTAddress(accounts[0]).call();

    //   }
    // }
  }, []);

  return (
    <div className={cn("section-bg", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrapper}>
          <h3 className={cn("h3", styles.title)}>NFT Collections</h3>
          <div className={styles.inner}>
            <Slider className="collection-slider" {...settings}>
              {collectItems.map((x, index) => (
                <form action="/search01" method="GET">
                  {console.log(x)}
                  <input type="hidden" name="collection" value={x.title} />
                  <button className={styles.item} key={index} type="submit" style={{ boxShadow: "5px 5px 5px 5px grey", padding: "10px", borderRadius: "10px" }}>
                    <div className={styles.gallery}>
                      {x.gallery.map((x, index) => (
                        <div className={styles.preview} key={index}>
                          <img src={x} width={'300'} height={'300'} alt="Collection" />
                        </div>
                      ))}
                    </div>
                    <div className={styles.subtitle}>{x.title}</div>
                    <div className={styles.line}>
                      <div className={styles.user}>
                        <div className={styles.avatar}>
                          <img src={x.avatar} alt="Avatar" />
                        </div>
                        <div className={styles.author}>
                          By <span>{x.author.toString().slice(0, 5) + "..." + x.author.toString().slice(-5)}</span>
                        </div>
                      </div>
                      <div className={cn("status-stroke-black", styles.counter)}>
                        <span>{x.counter}</span> items
                      </div>
                    </div>
                  </button>
                </form>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCollection;
