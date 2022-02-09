import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Search01.module.sass";
import { Range, getTrackBackground } from "react-range";
import Icon from "../../components/Icon";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";
import PhotoNFTData from "../../ABI/PhotoNFTData.json";
import Web3Init from "../../components/InitWeb3";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { getNFTDataAll } from "../../store/actions/bid_action";

const dispatch = useDispatch;

// data

const navLinks = ["All items", "Art", "Game", "Photography", "Music", "Video"];

const dateOptions = ["Newest", "Oldest"];
const likesOptions = ["Most liked", "Least liked"];
const colorOptions = ["All colors", "Black", "Green", "Pink", "Purple"];
const creatorOptions = ["Verified only", "All", "Most liked"];

const Search = () => {

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
        var filterItem = ItemDatas.filter((item) => item.status === "Open" && item.photoCollect === collection);
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
        <div className={styles.top}>
          <div className={styles.title}>Type your keywords</div>
          <form
            className={styles.search}
            action=""
            onSubmit={() => handleSubmit()}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search ..."
              required
            />
            <button className={styles.result}>
              <Icon name="search" size="16" />
            </button>
          </form>
        </div>
        <div className={styles.sorting}>
          <div className={styles.dropdown}>
            <Dropdown
              className={styles.dropdown}
              value={date}
              setValue={setDate}
              options={dateOptions}
            />
          </div>
          <div className={styles.nav}>
            {navLinks.map((x, index) => (
              <button
                className={cn(styles.link, {
                  [styles.active]: index === activeIndex,
                })}
                onClick={() => setActiveIndex(index)}
                key={index}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.filters}>
            <div className={styles.range}>
              <div className={styles.label}>Price range</div>
              <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: "8px",
                        width: "100%",
                        borderRadius: "4px",
                        background: getTrackBackground({
                          values,
                          colors: ["#3772FF", "#E6E8EC"],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#3772FF",
                      border: "4px solid #FCFCFD",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-33px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontFamily: "Poppins",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: "#141416",
                      }}
                    >
                      {values[0].toFixed(1)}
                    </div>
                  </div>
                )}
              />
              <div className={styles.scale}>
                <div className={styles.number}>0.01 Avax</div>
                <div className={styles.number}>10 Avax</div>
              </div>
            </div>
            <div className={styles.group}>
              <div className={styles.item}>
                <div className={styles.label}>Price</div>
                <Dropdown
                  className={styles.dropdown}
                  value={likes}
                  setValue={setLikes}
                  options={likesOptions}
                />
              </div>
              <div className={styles.item}>
                <div className={styles.label}>Color</div>
                <Dropdown
                  className={styles.dropdown}
                  value={color}
                  setValue={setColor}
                  options={colorOptions}
                />
              </div>
              <div className={styles.item}>
                <div className={styles.label}>Creator</div>
                <Dropdown
                  className={styles.dropdown}
                  value={creator}
                  setValue={setCreator}
                  options={creatorOptions}
                />
              </div>
            </div>
            <div className={styles.reset}>
              <Icon name="close-circle-fill" size="24" />
              <span>Reset filter</span>
            </div>
          </div>
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

export default connect(mapToStateProps, mapToDispatchProps)(Search);
