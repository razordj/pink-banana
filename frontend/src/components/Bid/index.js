import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Bid.module.sass";
import Modal from "../../components/Modal";
import { uploadBid } from "../../store/actions/bid_action";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import Web3Init from "../InitWeb3";

const dispatch = useDispatch;

const Bid = ({ className, balance, item, itemData, address }) => {

  const items = [
    {
      title: "Your balance",
      value: Number(balance).toFixed(3),
      symbol: 'ETH'
    },
    {
      title: "Service fee",
      value: 1,
      symbol: 'ETH'
    },
    {
      title: "Total bid amount",
      value: item.counter,
      symbol: 'ETH'
    },
  ];

  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [bidValue, setBidValue] = useState(0);
  // const [visiblemodal, setmodal] = useState(false);
  const uploadBidData = async () => {
    if (item.counter >= 0) {
      const web3 = await Web3Init();
      uploadBid(itemData.photoNFT, 10, web3.utils.toWei(bidValue.toString(), "ether"), address)(dispatch);
      setVisibleModalConfirm(true);
      window.location.reload();
    }
  }

  return (
    <div className={cn(className, styles.checkout)}>
      <div className={cn("h4", styles.title)}>Place a bid</div>
      <div className={styles.info}>
        You are about to purchase <strong>C O I N Z</strong> from{" "}
        <strong>UI8</strong>
      </div>
      <div className={styles.stage}>Your bid</div>
      <div className={styles.table}>
        <div className={styles.row}>
          <input className={styles.inputBid}
            placeholder="Enter your bid count number"
            value={bidValue}
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
        <button className={cn("button", styles.button)} onClick={() => { uploadBidData() }}>Place a bid</button>
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
  uploadBid: (payload) => dispatch(uploadBid(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Bid);
