import React from "react";
import cn from "classnames";
import styles from "./RemoveSale.module.sass";
import PhotoNFTMarketplace from "../../ABI/PhotoNFTMarketplace.json"
import Web3Init from "../InitWeb3";
import PhotoNFT from "../../ABI/PhotoNFT.json";
import { removeBid } from "../../store/actions/bid_action";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { useState } from "react";

const dispatch = useDispatch;

const RemoveSale = ({ className, user }) => {

  const [cAccount, setAccount] = useState("");

  const removeTrade = async () => {
    const web3 = await Web3Init();
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    if (PhotoNFTMarketplace.networks) {
      const deployedNetwork = PhotoNFTMarketplace.networks[networkId.toString()];
      const MarketContract = new web3.eth.Contract(
        PhotoNFTMarketplace.abi,
        deployedNetwork.address
      );
      if (deployedNetwork) {
        MarketContract.methods.cancelTrade(user.photoNFT, 1).send({ from: accounts[0] }).once("receipt", (receipt) => {
          let photoNFT = new web3.eth.Contract(PhotoNFT.abi, user.photoNFT);
          photoNFT.methods.approve(deployedNetwork.address, 1).send({ from: accounts[0] }).once('receipt', (receipt) => {
            removeBid(user.photoNFT)(dispatch);
            alert("Successfully completed!")
            window.location.href = "#";
          })
        });
      }
    }
  }
  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn("h4", styles.title)}>Remove from sale</div>
      <div className={styles.text}>
        Do you really want to remove your item from sale? You can put it on sale
        anytime
      </div>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} onClick={() => { removeTrade() }}>Remove now</button>


        <button className={cn("button-stroke", styles.button)}>Cancel</button>
      </div>
    </div>
  );
};

const mapToStateProps = ({ uploading }) => ({
  upload: uploading.upload
});

const mapToDispatchProps = (dispatch) => ({
  uploadBid: (payload) => dispatch(removeBid(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(RemoveSale);