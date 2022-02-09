import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./CollectionCard.module.sass";
import Icon from "../Icon";
import Modal from "../../components/Modal";
import Bid from "../../components/Bid";
import Web3Init from "../InitWeb3";
import Buy from "../Buy";

const CollectionCard = ({ className, item, itemData }) => {
  const [visible, setVisible] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [checkApprove, setCheckApprove] = useState(false);
  const [checkOwner, setCheckOwner] = useState(false);

  useEffect(async () => {

    await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (data) => {
      const web3 = await Web3Init();
      const balance = await web3.eth.getBalance(data[0]);
      setAddress(data[0]);
      setBalance(web3.utils.fromWei(balance.toString(), "ether"));
    });
  }, [item]);
  console.log(item.image)

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        <img src={item.image} alt="Card" />
        <div className={styles.control}>
          <div
            className={cn(
              { "status-green": item.category === "green" },
              styles.category
            )}
          >
            {item.categoryText}
          </div>
          <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <Icon name="heart" size="20" />
          </button>
          {checkOwner ?
            <form action="/ItemView" methods="GET">
              <input type="hidden" name="tokenID" value={itemData.photoNFT} />
              <button className={cn("button-small", styles.button)}
                type="submit"
              >
                <span>View Detail</span>
                <Icon name="scatter-up" size="16" />
              </button>
            </form>
            : checkApprove ?
              <button className={cn("button-small", styles.button)}
                onClick={() => {
                  setVisibleModalBid(true);
                }}
              >
                <Modal
                  visible={visibleModalBid}
                  onClose={() => setVisibleModalBid(false)}
                >
                  <Buy balance={balance} item={item} itemData={itemData} address={address} />
                </Modal>
                <span>Buy Now</span>
                <Icon name="scatter-up" size="16" />
              </button>
              :
              <button className={cn("button-small", styles.button)}
                onClick={() => {
                  setVisibleModalBid(true);
                }}
              >
                <Modal
                  visible={visibleModalBid}
                  onClose={() => setVisibleModalBid(false)}
                >
                  <Bid balance={balance} item={item} itemData={itemData} address={address} />
                </Modal>
                <span>Collection Detail</span>
                <Icon name="scatter-up" size="16" />
              </button>}
        </div>
      </div>
      <div className={styles.CardDetail}>
        <div style={{ fontSize: '20px' }}>{item.name}</div>
        <div style={{ fontSize: '16px' }}>{item.description}</div>
      </div>
    </div>
  );
};


export default CollectionCard;

