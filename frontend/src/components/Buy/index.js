import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Buy.module.sass";
import Modal from "../../components/Modal";
import { removeBid } from "../../store/actions/bid_action";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import Web3Init from "../InitWeb3";
import PhotoNFTMakretplace from "../../ABI/PhotoNFTMarketplace.json";
import PhotoNFT from "../../ABI/PhotoNFT.json"

const dispatch = useDispatch;

const Buy = ({ className, balance, item, itemData, address }) => {

  const items = [
    {
      title: "Balance",
      value: Number(balance).toFixed(3),
      symbol: 'ETH'
    },
    {
      title: "Service fee",
      value: 1,
      symbol: 'ETH'
    },
    {
      title: "Max NFT Price",
      value: item.checkBid.bidApprovePrice,
      symbol: 'ETH'
    },
  ];

  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [bidValue, setBidValue] = useState(0);
  // const [visiblemodal, setmodal] = useState(false);
  const buyNFT = async () => {
    const web3 = await Web3Init();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    if (PhotoNFTMakretplace.networks) {
      const deployedNetwork = PhotoNFTMakretplace.networks[networkId.toString()];
      const MarketContract = new web3.eth.Contract(
        PhotoNFTMakretplace.abi,
        deployedNetwork.address
      );
      if (deployedNetwork) {
        MarketContract.methods.buyPhotoNFT(itemData.photoNFT).send({ from: accounts[0], value: web3.utils.toWei(item.checkBid.bidApprovePrice.toString(), "ether") }).once("receipt", (receipt) => {
          let photoNFT = new web3.eth.Contract(PhotoNFT.abi, itemData.photoNFT);
          photoNFT.methods.approve(deployedNetwork.address, 1).send({ from: accounts[0] }).once('receipt', (receipt) => {
            removeBid(itemData.photoNFT)(dispatch);
            setVisibleModalConfirm(true);
            window.location.reload();
          });
        });
      }
    }
  }

  return (
    <div className={cn(className, styles.checkout)}>
      <div className={cn("h4", styles.title)}>Buy Now</div>
      <div className={styles.info}>
        You are about to purchase <strong>C O I N Z</strong> from{" "}
        <strong>UI8</strong>
      </div>
      <div className={styles.stage}>Setting</div>
      <div className={styles.table}>
        <div className={styles.row}>
          <input className={styles.inputBid}
            placeholder="Enter your bid count number"
            value={`${Number(item.checkBid.bidApprovePrice)} ETH`}
            onChange={(e) => setBidValue(e.target.value)} />
          <div className={styles.col}></div>
        </div>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{bidValue === "" ? parseFloat(x.value) : index == 0 ? parseFloat(x.value) - parseFloat(bidValue) : x.value}</div>
          </div>
        ))}
      </div>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} onClick={() => { buyNFT() }}>Buy</button>
        <button className={cn("button-stroke", styles.button)} onClick={() => setVisibleModalBid(true)}>Cancel</button>
      </div>
      <Modal
        visible={visibleModalBid}
      />
      <Modal
        visible={visibleModalConfirm}
        onClose={() => setVisibleModalConfirm(false)}
      >Successfully done!</Modal>
    </div>
  );
};

const mapToStateProps = ({ uploading }) => ({
  upload: uploading.upload
});

const mapToDispatchProps = (dispatch) => ({
  uploadBid: (payload) => dispatch(removeBid(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Buy);
