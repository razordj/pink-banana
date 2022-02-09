import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../Icon";
import Modal from "../../components/Modal";
import Bid from "../../components/Bid";
import Web3Init from "../InitWeb3";
import Buy from "../Buy";

const Card = ({ className, item, itemData }) => {
  const [visible, setVisible] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [checkApprove, setCheckApprove] = useState(false);
  const [checkOwner, setCheckOwner] = useState(false);

  useEffect(async ()=> {
    
    await window.ethereum.request({method: 'eth_requestAccounts'}).then(async(data) => {
      const web3 = await Web3Init();
      const balance = await web3.eth.getBalance(data[0]);
      setAddress(data[0]);
      setBalance(web3.utils.fromWei(balance.toString(), "ether"));
      if(itemData){
      if(itemData.ownerAddress.toUpperCase() === data[0].toUpperCase()){
          setCheckOwner(true);
      }
    }
      if(item.checkBid !== undefined){
        if(item.checkBid._id !== undefined){
        setCheckApprove(true);
      }
      }
    });
  }, [item]);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        <img srcSet={`${item.image2x} 2x`} src={item.image} alt="Card" />
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
          {checkOwner?
              <button className={cn("button-small", styles.button)}
              >
                
                <span>Your Token</span>
                <Icon name="scatter-up" size="16" />
              </button>
          : checkApprove ? 
            <button className={cn("button-small", styles.button)}
            onClick={()=>{
              setVisibleModalBid(true);
            }}
            >
              <Modal
              visible={visibleModalBid}
              onClose={() => setVisibleModalBid(false)}
            >
              <Buy balance ={balance} item = {item} itemData = {itemData} address= {address}/>
            </Modal>
              <span>Buy Now</span>
              <Icon name="scatter-up" size="16" />
            </button>
          :
          <button className={cn("button-small", styles.button)}
          onClick={()=>{
            setVisibleModalBid(true);
          }}
          >
            <Modal
            visible={visibleModalBid}
            onClose={() => setVisibleModalBid(false)}
          >
            <Bid balance ={balance} item = {item} itemData = {itemData} address= {address}/>
          </Modal>
            <span>Place a bid</span>
            <Icon name="scatter-up" size="16" />
          </button>}
        </div>
      </div>
      <Link className={styles.link} to={item.url}>
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.price}>{item.price}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.users}>
              {item.users.map((x, index) => (
                <div className={styles.avatar} key={index}>
                  <img src={x.avatar} alt="Avatar" />
                </div>
              ))}
            </div>
            <div className={styles.counter}>{`${item.counter} in stacks`}</div>
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.status}>
            <Icon name="candlesticks-up" size="20" />
            Highest bid <span>{item.highestBid}</span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          />
        </div>
      </Link>
    </div>
  );
};


export default Card;

