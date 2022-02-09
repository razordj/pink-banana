import React, {useEffect, useState} from "react";
import cn from "classnames";
import styles from "./Accept.module.sass";
import Modal from "../../../../components/Modal";
import { approveBid } from "../../../../store/actions/bid_action";
import {connect} from "react-redux";
import { useDispatch } from 'react-redux'
import Web3Init from "../../../../components/InitWeb3";
const dispatch = useDispatch;

const Accept = ({ className, bidData, acceptUser }) => {
  const items = [
    {
      title: "Service fee",
      value: 0,
      // symbol: 'ETH'
    },
    {
      title: "Total bid amount",
      value: bidData.length,
      symbol: ''
    },
  ];
  const [acceptMaxValue, setAcceptMaxValue] = useState(0);
  const [acceptValue, setAcceptValue] = useState(0);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const setAcceptBid = async () => {
    approveBid(acceptUser._id, acceptValue)(dispatch);
    setVisibleModalConfirm(true);
  }

  useEffect(async()=>{
    const web3 = await Web3Init();
    const max = await web3.utils.fromWei(acceptUser.bidPrice.toString(), "ether");
    setAcceptMaxValue(max);
  }, []);

  useEffect(()=>{
    if(Number(acceptValue) > Number(acceptMaxValue)){
      alert(`Max Price is ${acceptMaxValue}`);
      setAcceptValue(0);
    }
  });

  return (
    <div className={cn(className, styles.accept)}>
      <div className={styles.line}>
        <div className={styles.icon}></div>
        <div className={styles.text}>
          You are about to accept a bid for <strong>COINZ</strong> from{" "}
          <strong>UI8</strong>
        </div>
      </div>
      <input className={styles.inputAccept}
            type="number"
            placeholder="1.46 ETH for 1 edition"
            value = {acceptValue}
            max={Number(acceptMaxValue)}
            onChange={(e) => setAcceptValue(e.target.value)}
            required
      />
      <div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            {x.title === "Service fee" ? <div className={styles.col}>{x.value}</div> : <div className={styles.col}>{bidData.length}</div>}
          
            <div className={styles.col}>{x.symbol}</div>
          </div>
        ))}
      </div>
      <div className={styles.AcceptBtns}>
        <button className={cn("button", styles.button)} type="submit" onClick={() => setAcceptBid()}>Accept bid</button>
        <button className={cn("button-stroke", styles.button)} onClick={() => setVisibleModalAccept(true)}>Cancel</button>
      </div>
      <Modal 
        visible={visibleModalAccept}
      /> 
      <Modal
        visible={visibleModalConfirm}
        onClose={() => setVisibleModalConfirm(false)}
      >Successfully done!</Modal>     
    </div>
  );
};

const mapToStateProps = ({uploading}) => ({
  upload: uploading.upload
});

const mapToDispatchProps = (dispatch) => ({
  uploadBid: (payload) => dispatch(approveBid(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Accept);
