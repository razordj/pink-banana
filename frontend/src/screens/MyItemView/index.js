import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./MyItem.module.sass";
import { Range, getTrackBackground } from "react-range";
import Icon from "../../components/Icon";
import Card from "../../components/MyItemCard";
import Dropdown from "../../components/Dropdown";
import PhotoNFTData from "../../ABI/PhotoNFTData.json";
import Web3Init from "../../components/InitWeb3";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { getNFTDataAll } from "../../store/actions/bid_action";
import { useLocation } from "react-router-dom";
const dispatch = useDispatch;

// data

const navLinks = ["All items", "Art", "Game", "Photography", "Music", "Video"];

const dateOptions = ["Newest", "Oldest"];
const likesOptions = ["Most liked", "Least liked"];
const colorOptions = ["All colors", "Black", "Green", "Pink", "Purple"];
const creatorOptions = ["Verified only", "All", "Most liked"];

const MyItemView = () => {


  const [activeIndex, setActiveIndex] = useState(0);
  const [date, setDate] = useState(dateOptions[0]);
  const [likes, setLikes] = useState(likesOptions[0]);
  const [color, setColor] = useState(colorOptions[0]);
  const [creator, setCreator] = useState(creatorOptions[0]);
  const [filterItems, setFilterItems] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [values, setValues] = useState([5]);
  const [loading, setLoading] = useState(false);
  const rsearch = useLocation().search;
  const collection = new URLSearchParams(rsearch).get("collection");

  const handleSubmit = (e) => {
    alert();
  };
  useEffect(async () => {
    setLoading(true);
    const bidData = await getNFTDataAll()(dispatch);
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
        const fItems = [];
        const ItemDatas = await photoNFTData.methods.getAllPhotos().call();
        var filterItem = ItemDatas.filter((item) => item.ownerAddress === accounts[0] && item.photoCollect === collection);
        setItems(filterItem);
        filterItem.map(async (item) => {
          var fItem = {};
          var bidTotalAmount = 0;
          var maxBidPrice = 0;
          var bidUserData = [];
          const bidMaxPrice = 0;
          for (let i = 0; i < bidData.length; i++) {
            if (bidData[i].nftId === item.photoNFT) {
              bidTotalAmount++;
              if (Number(bidData[i].bidPrice) > Number(maxBidPrice)) {
                maxBidPrice = Number(bidData[i].bidPrice);
              }
              if (bidData[i].bidAddress.toUpperCase() === accounts[0].toUpperCase() && bidData[i].bidApprove === true) {
                if (Number(bidMaxPrice) < Number(bidData[i].bidApprovePrice)) {
                  bidUserData = bidData[i];
                }
              }
            }
          }
          fItem.checkBid = bidUserData;
          fItem.title = item.photoNFTName;
          fItem.price = web3.utils.fromWei(item.photoPrice, "ether") + "ETH";
          fItem.highestBid = `${web3.utils.fromWei(maxBidPrice.toString(), "ether")} ETH`;
          fItem.counter = bidTotalAmount;
          fItem.bid = 'New bid <span role="img" aria-label="fire">🔥</span>';
          fItem.image = `https://ipfs.io/ipfs/${item.ipfsHashOfPhoto}`;
          fItem.image2x = `https://ipfs.io/ipfs/${item.ipfsHashOfPhoto}`;
          fItem.category = "green";
          fItem.categoryText = "purchasing !";
          fItem.url = "/";
          fItem.users = [
            {
              avatar: "/images/content/avatar-1.jpg",
            },
            {
              avatar: "/images/content/avatar-4.jpg",
            },
          ];
          fItems.push(fItem);
        });
        setFilterItems(fItems);
      }
    }
    setLoading(false);
  }, [])

  const STEP = 0.1;
  const MIN = 0.01;
  const MAX = 10;

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.row}>
          <div className={styles.wrapper}>
            <div className={styles.list}>
              {filterItems.map((x, index) => (
                <Card className={styles.card} item={x} itemData={items[index]} key={index} />
              ))}
            </div>
            <div className={styles.btns}>
              <button className={cn("button-stroke", styles.button)}>
                <span>Load more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapToStateProps = ({ uploading }) => ({
  upload: uploading.upload
});

const mapToDispatchProps = (dispatch) => ({
  uploadBid: (payload) => dispatch(getNFTDataAll(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(MyItemView);
