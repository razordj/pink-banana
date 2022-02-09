import React, { useState } from "react";
import cn from "classnames";
import styles from "./PutSale.module.sass";
import Icon from "../../../../components/Icon";
import Switch from "../../../../components/Switch";
import Modal from "../../../../components/Modal";
import Web3Init from "../../../../components/InitWeb3"
import PhotoNFTMakretplace from "../../../../ABI/PhotoNFTMarketplace.json";

const items = [
  {
    title: "Service fee",
    value: 1.5,
    symbol: '%'
  },
  {
    title: "Total bid amount",
    value: 0,
    symbol: "ETH"
  },
];

const PutSale = ({ className, user }) => {
  const [price, setPrice] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [saleValue, setBidSale] = useState(0);
  const setPutSale = async () => {
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
        const rPrice = web3.utils.toWei(saleValue.toString(), "ether");
        // MarketContract.methods.openTrade(user.photoNFT, 0, rPrice).send({from: accounts[0]});
        const checkAddress = await MarketContract.methods.trades(user.photoNFT).call();
        if (checkAddress.seller === "0x0000000000000000000000000000000000000000") {
          MarketContract.methods.openTrade(user.photoNFT, 1, rPrice).send({ from: accounts[0] }).on("receipt", () => alert("nice"));
        }
        else {
          MarketContract.methods.registerTradeWhenCreateNewPhotoNFT(user.photoNFT, "1", rPrice, accounts[0]).send({ from: accounts[0] }).on("receipt", async () => {
            MarketContract.methods.openTrade(user.photoNFT, 1, rPrice).send({ from: accounts[0] }).on("receipt", () => {
              setVisibleModalConfirm(true);
              window.location.reload();
            });
          });
        }
      }
    }
  }

  return (
    <div className={cn(className, styles.sale)}>
      <div className={cn("h4", styles.title)}>Put on sale</div>
      <div className={styles.line}>
        <div className={styles.icon}>
          <Icon name="coin" size="24" />
        </div>
        <div className={styles.details}>
          <div className={styles.info}>Instant sale price</div>
          <div className={styles.text}>
            Enter the price for which the item will be instanly sold
          </div>
        </div>
        <Switch className={styles.switch} value={price} setValue={setPrice} />
      </div>
      <div className={styles.row}>
        <input className={styles.inputSale}
          placeholder="Enter your price"
          value={saleValue}
          onChange={(e) => setBidSale(e.target.value)} />
        <div className={styles.col}></div>
      </div>
      <div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{index == 1 ? parseFloat(x.value) + parseFloat(saleValue) : x.value}</div>
            <div className={styles.col}>{x.symbol}</div>
          </div>
        ))}
      </div>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} onClick={() => setPutSale()}>Continue</button>
        <button className={cn("button-stroke", styles.button)} onClick={() => setVisibleModalSale(true)}>Cancel</button>
      </div>
      <Modal
        visible={visibleModalSale}
      />
      <Modal
        visible={visibleModalConfirm}
        onClose={() => setVisibleModalConfirm(false)}
      >Successfully put on sale!</Modal>
    </div>
  );
};



export default PutSale;
