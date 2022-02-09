import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import Web3Init from "../../InitWeb3";
import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import { findOne } from "../../../store/actions/user.action";;

const dispatch = useDispatch;

const items = [
  {
    title: "My profile",
    icon: "user",
    url: "/profile",
  },
  {
    title: "My items",
    icon: "image",
    url: "/userCollection",
  },
  {
    title: "Dark theme",
    icon: "bulb",
  }
];

const User = ({ className, user, logout }) => {
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [userData, setUserData] = useState([]);
  useEffect(async () => { 
    await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (data) => {
      setAddress(data[0]);
      const web3 = await Web3Init();
      const balance = await web3.eth.getBalance(data[0]);
      setBalance(web3.utils.fromWei(balance.toString(), "ether"));
      const userData = await findOne(data[0])(dispatch);
      setUserData(userData);
    })
  }, [user]);
  
  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
        <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.avatar}>
            {userData.profilePhoto ?
              <img src={userData.userImg} alt="Avatar" />
              : <img src="/images/content/main_avatar.png" alt="Avatar" />
            }
          </div>
          <div className={styles.wallet}>
            {Number(balance).toFixed(3)} <span className={styles.currency}>AVAX</span>
          </div>
        </div>
        {visible && (
          <div className={styles.body}>
            <div className={styles.name}>Enrico Cole</div>
            <div className={styles.code}>
              <div className={styles.number}>{address.substr(0, 14) + "..." + address.substr(address.length - 4)}</div>
              <button className={styles.copy}>
                <Icon name="copy" size="16" />
              </button>
            </div>
            <div className={styles.wrap}>
              <div className={styles.line}>
                <div className={styles.preview}>
                  <img
                    src="/images/content/avalanche-avax-logo.png"
                    alt="Avax"
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.info}>Balance</div>
                  <div className={styles.price}>{Number(balance).toFixed(2)} AVAX</div>
                </div>
              </div>
              <button
                className={cn("button-stroke button-small", styles.button)}
              >
                Manage fun on Coinbase
              </button>
            </div>
            <div className={styles.menu}>
              {items.map((x, index) =>
                x.url ? (
                  x.url.startsWith("http") ? (
                    <a
                      className={styles.item}
                      href={x.url}
                      rel="noopener noreferrer"
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </a>
                  ) : (
                    <Link
                      className={styles.item}
                      to={x.url}
                      onClick={() => setVisible(!visible)}
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </Link>
                  )
                ) : (
                  <div className={styles.item} key={index}>
                    <div className={styles.icon}>
                      <Icon name={x.icon} size="20" />
                    </div>
                    <div className={styles.text}>{x.title}</div>
                    <Theme className={styles.theme} />
                  </div>
                )
              )}
              <a
                className={styles.item}
                href="#"
              >
                <div className={styles.icon}>
                  <Icon name="exit" size="20" />
                </div>
                <div className={styles.text} onClick={() => logout()}>Disconnect</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};


const mapToStateProps = ({ auth }) => ({
  user: auth.user
});

const mapToDispatchProps = (dispatch) => ({
  user: (payload) => dispatch(findOne(payload))
})


export default connect(mapToStateProps, mapToDispatchProps)(User);