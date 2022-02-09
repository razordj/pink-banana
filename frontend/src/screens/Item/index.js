import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Item.module.sass";
import Users from "./Users";
import Control from "./Control";
import Options from "./Options";
import Web3Init from "../../components/InitWeb3";
import PhotoNFTData from "../../ABI/PhotoNFTData.json";
import { getNFTDataById } from "../../store/actions/bid_action";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux'
import axios from "axios";
import { useLocation } from "react-router-dom";

const dispatch = useDispatch;

const navLinks = ["Info", "Owners", "History", "Offers"];

const categories = [
  {
    category: "black",
    content: "art",
  },
  {
    category: "purple",
    content: "unlockable",
  },
];

const users = [
  {
    name: "Raquel Will",
    position: "Owner",
    avatar: "/images/content/avatar-2.jpg",
    reward: "/images/content/reward-1.svg",
  },
  {
    name: "Selina Mayert",
    position: "Creator",
    avatar: "/images/content/avatar-1.jpg",
  },
];

const Item = () => {
  const search = useLocation().search;
  const tokenId = new URLSearchParams(search).get("tokenID");
  const [activeIndex, setActiveIndex] = useState(0);
  const [ItemDatas, setItemData] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cEPrice, setCEPrice] = useState(0);
  useEffect(async () => {
    setLoading(true);
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
        const r_items = [];
        var my_items = ItemDatas.filter((item) => item.photoNFT === tokenId)
        for (let i = 0; i < my_items.length; i++) {
          const r_item = {};
          r_item.createdAt = my_items[i].createdAt;
          r_item.ipfsHashOfPhoto = my_items[i].ipfsHashOfPhoto;
          r_item.ownerAddress = my_items[i].ownerAddress;
          r_item.photoNFT = my_items[i].photoNFT;
          r_item.photoNFTDesc = my_items[i].photoNFTDesc;
          r_item.photoNFTName = my_items[i].photoNFTName;
          r_item.photoNFTSymbol = my_items[i].photoNFTSymbol;
          r_item.photoPrice = web3.utils.fromWei(my_items[i].photoPrice.toString(), "ether");
          r_item.premiumStatus = my_items[i].premiumStatus;
          r_item.status = my_items[i].status;
          r_item.bidData = await getNFTDataById(my_items[i])(dispatch);
          r_items.push(r_item);
        }
        setItemData(r_items);
      }
      const cPrice = await axios.get("https://api.coinbase.com/v2/exchange-rates?currency=ETH").then((res) => {
        setCEPrice(res.data.data.rates.USD);
      })
    }
    setLoading(false);
  }, [])

  return (
    <>
      {
        ItemDatas.map((ItemData, index) => {
          return (
            <div className={cn("section", styles.section)} key={index}>
              <div className={cn("container", styles.container)}>
                <div className={styles.bg}>
                  <div className={styles.preview}>
                    <div className={styles.categories}>
                      {categories.map((x, index) => (
                        <div
                          className={cn(
                            { "status-black": x.category === "black" },
                            { "status-purple": x.category === "purple" },
                            styles.category
                          )}
                          key={index}
                        >
                          {x.content}
                        </div>
                      ))}
                    </div>
                    <img
                      // srcSet="/images/content/item-pic@2x.jpg 2x"
                      // srcSet={`http://ipfs.io/ipfs/${ItemData.ipfsHashOfPhoto}`}
                      src={`http://ipfs.io/ipfs/${ItemData.ipfsHashOfPhoto}`}
                      alt={`http://ipfs.io/ipfs/${ItemData.ipfsHashOfPhoto}`}
                    />
                  </div>
                  <Options className={styles.options} isOwner={true} />
                </div>
                <div className={styles.details}>
                  <h1 className={cn("h3", styles.title)}>{ItemData.photoNFTName}</h1>
                  <div className={styles.cost}>
                    <div className={cn("status-stroke-green", styles.price)}>
                      {ItemData.photoPrice} ETH
                </div>
                    <div className={cn("status-stroke-black", styles.price)}>
                      ${Number(cEPrice * ItemData.photoPrice).toFixed(2)}
                    </div>
                    <div className={styles.counter}>{ItemData.bidData.length} in stock</div>
                  </div>
                  <div className={styles.info}>{ItemData.photoNFTDesc}</div>
                  <div className={styles.nav}>
                    {navLinks.map((x, index) => (
                      <button
                        className={cn(
                          { [styles.active]: index === activeIndex },
                          styles.link
                        )}
                        onClick={() => setActiveIndex(index)}
                        key={index}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                  <Users className={styles.users} items={users} />
                  <Control className={styles.control} isOwner={isOwner} user={ItemDatas} />
                </div>
              </div>
            </div>
          )
        })
      }
    </>
  );
};

const mapToStateProps = ({ uploading }) => ({
  upload: uploading.upload
});

const mapToDispatchProps = (dispatch) => ({
  uploadBid: (payload) => dispatch(getNFTDataById(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Item);
