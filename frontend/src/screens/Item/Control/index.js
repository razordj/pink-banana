import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Control.module.sass";
import Checkout from "./Checkout";
import Connect from "../../../components/Connect";
import Bid from "../../../components/Bid";
import Accept from "./Accept";
import PutSale from "./PutSale";
import Confirm from "./Confirm";
import SuccessfullyPurchased from "./SuccessfullyPurchased";
import Modal from "../../../components/Modal";
import RemoveSale from "../../../components/RemoveSale";
import Web3Init from "../../../components/InitWeb3";
import axios from "axios";

const Control = ({ className, isOwner, user }) => {
  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [maxBidValue, setMaxBidValue] = useState(0);
  const [acceptUser, setAcceptUser] = useState([]);
  const [cEPrice, setCEPrice] = useState(0);
  const [cAccount, setAccount] = useState("");


  useEffect(async () => {
    const web3 = await Web3Init();
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    if (user[0].bidData.length !== 0) {
      let maxValue = 0;
      for (let i = 0; i < user[0].bidData.length; i++) {
        if (Number(user[0].bidData[i].bidPrice) > Number(maxValue)) {
          maxValue = user[0].bidData[i].bidPrice;
          setAcceptUser(user[0].bidData[i]);
        }
      }
      setMaxBidValue(Number(web3.utils.fromWei(maxValue.toString(), "ether")).toFixed(3));
    }
    const cPrice = await axios.get("https://api.coinbase.com/v2/exchange-rates?currency=ETH").then((res) => {
      setCEPrice(res.data.data.rates.USD);
    })
  }, [user]);

  const setAcceptNFT = () => {
    if (user[0].bidData.length === 0) {
      alert("No user has placed a bid.");
    }
    else {
      setVisibleModalAccept(true);
    }
  }


  return (
    <>
      <div className={cn(styles.control, className)}>
        {
          user[0].status === "Open" && cAccount === user[0].ownerAddress ?
            <div className={styles.head}>
              <div className={styles.avatar}>
                <img src="/images/content/avatar-4.jpg" alt="Avatar" />
              </div>
              <div className={styles.details}>
                <div className={styles.info}>
                  Highest bid by <span>Kohaku Tora</span>
                </div>
                <div className={styles.cost}>
                  <div className={styles.price}>{maxBidValue} ETH</div>
                  <div className={styles.price}>${Number(maxBidValue * cEPrice).toFixed(2)}</div>
                </div>
              </div>
            </div>
            : null
        }
        {
          isOwner && cAccount === user[0].ownerAddress &&
          <div className={styles.btns}>
            <button
              className={cn("button", styles.button)}
              onClick={() => setVisibleModalPurchase(true)}
            >
              Purchase now
            </button>
            <button
              className={cn("button-stroke", styles.button)}
              onClick={() => setVisibleModalBid(true)}
            >
              Make an Offer
            </button>
          </div>
        }
        {
          !isOwner && user[0].status !== "Open" ?
            <>

              <div className={styles.text}>
                Service fee <span className={styles.percent}>1.5%</span>{" "}
                <span>2.563 ETH</span> <span>$4,540.62</span>
              </div>
              <div className={styles.foot}>
                {cAccount === user[0].ownerAddress ?
                  <button
                    className={cn("button", styles.button)}
                    onClick={() => setVisibleModalSale(true)}
                  >
                    Put on sale
                  </button>
                  :
                  <button
                    className={cn("button", styles.button)}
                  >
                    You are not Owner
                </button>
                }
              </div>
            </>
            :

            <>
              {cAccount === user[0].ownerAddress ?
                <>
                  <div className={styles.btns}>
                    <button className={cn("button-stroke", styles.button)}>
                      View all
              </button>
                    <button
                      className={cn("button", styles.button)}
                      onClick={() => setAcceptNFT()}
                      style={{ marginBottom: "20px" }}
                    >
                      Accept
                   </button>
                  </div>

                  <RemoveSale user={user[0]} />
                </>
                : <button
                  className={cn("button", styles.button)}
                  style={{ marginBottom: "20px" }}
                >
                  You are not Owner
             </button>}

            </>
        }
        {cAccount === user.ownerAddress ?
          <div className={styles.note}>
            You can sell this token on Crypter Marketplace
        </div>
          : null}
      </div>

      <Modal
        visible={visibleModalPurchase}
        onClose={() => setVisibleModalPurchase(false)}
      >
        <Checkout />
        <SuccessfullyPurchased />
      </Modal>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        <Connect />
        <Bid />
      </Modal>
      <Modal
        visible={visibleModalAccept}
        onClose={() => setVisibleModalAccept(false)}
      >
        <Accept bidData={user[0].bidData} acceptUser={acceptUser} />
      </Modal>
      <Modal
        visible={visibleModalSale}
        onClose={() => setVisibleModalSale(false)}
      >
        <PutSale user={user[0]} />
      </Modal>
      <Modal
        visible={visibleModalConfirm}
        onClose={() => setVisibleModalConfirm(false)}
      >
        <Confirm />
      </Modal>
    </>
  );
};

export default Control;
