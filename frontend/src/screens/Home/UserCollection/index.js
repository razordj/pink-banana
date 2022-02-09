import React, { useEffect, useState } from "react";
import cn from "classnames";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import styles from "./UserCollections.module.sass";
import Icon from "../../../components/Icon";
import PhotoNFTData from "../../../ABI/PhotoNFTData.json";
import Web3Init from "../../../components/InitWeb3";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { collectinNames, getCollectData, viewCollectData } from "../../utils";
const dispatch = useDispatch;

// const items = [
//   {
//     title: "Awesome collection",
//     author: "Kennith Olson",
//     counter: "28",
//     avatar: "/images/content/avatar-1.jpg",
//     gallery: [
//       "/images/content/photo-1.1.jpg",
//       "/images/content/photo-1.2.jpg",
//       "/images/content/photo-1.3.jpg",
//       "/images/content/photo-1.4.jpg",
//     ],
//   },
//   {
//     title: "Awesome collection",
//     author: "Willie Barton",
//     counter: "28",
//     avatar: "/images/content/avatar-3.jpg",
//     gallery: [
//       "/images/content/photo-2.1.jpg",
//       "/images/content/photo-2.2.jpg",
//       "/images/content/photo-2.3.jpg",
//       "/images/content/photo-2.4.jpg",
//     ],
//   },
//   {
//     title: "Awesome collection",
//     author: "Halle Jakubowski",
//     counter: "28",
//     avatar: "/images/content/avatar-4.jpg",
//     gallery: [
//       "/images/content/photo-3.1.jpg",
//       "/images/content/photo-3.2.jpg",
//       "/images/content/photo-3.3.jpg",
//       "/images/content/photo-3.4.jpg",
//     ],
//   },
// ];

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
    const web3 = await Web3Init();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    if (PhotoNFTData.networks) {
      const deployedNetwork = PhotoNFTData.networks[networkId.toString()];
      const photoNFTData = new web3.eth.Contract(
        PhotoNFTData.abi,
        deployedNetwork && deployedNetwork.address
      );
      if (deployedNetwork) {
        // const ItemData = await photoNFTData.methods.getPhotoByNFTAddress(accounts[0]).call();
        const ItemDatas = await photoNFTData.methods.getAllPhotos().call();
        var filterItem = ItemDatas.filter((item) => item.ownerAddress === accounts[0]);
        const cNames = collectinNames(filterItem);
        const collectData = await getCollectData(cNames);
        // setFilterItems(collectData);
        console.log(collectData)
        const viewData = viewCollectData(collectData);
        setCollectItems(viewData);
      }
    }
  }, []);

  return (
    <div className={cn("section-bg", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrapper}>
          <h3 className={cn("h3", styles.title)}>Your collections</h3>
          <div className={styles.inner}>
            <Slider className="collection-slider" {...settings}>
              {collectItems.map((x, index) => (
                <form action="/MyItemView" method="GET">
                  {console.log(x)}
                  <input type="hidden" name="collection" value={x.title} />
                  <button className={styles.item} key={index} type="submit" style={{ boxShadow: "5px 5px 5px 5px grey", padding: "10px", borderRadius: "10px" }}>
                    <div className={styles.gallery}>
                      {x.gallery.map((x, index) => (
                        <div className={styles.preview} key={index}>
                          <img src={x} alt="Collection" width={'300'} height={'300'} />
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
