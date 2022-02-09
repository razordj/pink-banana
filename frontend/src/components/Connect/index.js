import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import User from "../Header/User";
import { connect } from "react-redux";
import { authLogout, authSet } from "../../store/actions/auth.actions";
import cn from "classnames";
import styles from "./Connect.module.sass";
import Icon from "../Icon";
import Modal from "../../components/Modal";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import Web3 from "web3";

const Connect = (props, className) => { 
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [user, setUser] = useState({});
  let [web3, setWeb3] = useState({});

  useEffect(() => { 
    setUser(props.user);
  },[props]);

  const connectWallet = async function() {
    if(window.ethereum != null) {
      const WEB3 = new Web3(window.ethereum);
      setWeb3(WEB3);
      try{
        await window.ethereum.enable();
        await props.authSet(WEB3);
        toast.success("Connected", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) { console.log("erroe", error.message)
        toast.warning(<>{error.message}</>, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      toast.error("Install Metamask.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <div >
      <a
        target="_blank"
        rel="noreferrer"
      >
        <ToastContainer />
      </a>
      <div className={styles.icon}>
        <Icon name="wallet" size="24" />
      </div>
      <div className={styles.info}>
        You need to connect your wallet first to sign messages and send
        transaction to Binance network
      </div>
      <div className={styles.btns}>
      {!Object.keys(user).length ?
          <p
            className={cn("button-stroke button-small", styles.button)}
            onClick={connectWallet}
          >
            Connect Wallet
          </p>
          : <p
              className={cn("button-stroke button-small", styles.button)}
            >
              Connected
            </p>
        }
        <button className={cn("button-stroke", styles.button)} onClick={() => setVisibleModalBid(true)}>Cancel</button>
      </div>
      <Modal 
        visible={visibleModalBid}
      />
     
    </div>
  );
};

const mapToStateProps = ({auth}) => ({
  user: auth.user
})

const mapToDispatchProps = dispatch => ({
  authLogout: () => dispatch(authLogout()),
  authSet: (payload) => dispatch(authSet(payload))
})

export default  connect(mapToStateProps, mapToDispatchProps)(Connect);
