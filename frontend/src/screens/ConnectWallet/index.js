import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./ConnectWallet.module.sass";
import Icon from "../../components/Icon";
import Web3 from "web3";
// import MetaMaskLoginButton from "react-metamask-login-button";
import {connect} from "react-redux";
import { authSet } from "../../store/actions/auth.actions";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

const Connect = (props) => { console.log("propes", props)

  let [web3, setWeb3] = useState({});
  const [address, setAddress] = useState('');
  const centerStyle ={
    textAlign: 'center'
  }

  useEffect(async () => {
    if(window.ethereum != null && Object.keys(props.user).length) {
      await window.ethereum.request({method: 'eth_requestAccounts'}).then(async (data) => {
        setAddress(data[0]);
      })
    }
    else {
      setAddress('');
    }
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
      } catch (error) {
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
    <div className={cn("section-pt80", styles.section)}>
      <a
        target="_blank"
        rel="noreferrer"
      >
        <ToastContainer />
      </a>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <Link className={styles.back} to="/">
            <Icon name="arrow-prev" size="24" />
            <div className={cn("h2", styles.stage)}>Connect your wallet</div>
          </Link>
        </div>
        <div className={styles.body} style={centerStyle}>
            <img src="./metamask.png" alt="Metasmask icon" />
            {
              !address ?
              <button onClick={ () => connectWallet() } className={cn("button-stroke button-bg", styles.button)}>
                Connect Wallet
              </button>
              : <label className={cn("button-stroke button-bg", styles.button)}>{address.substr(0,14) + "..." + address.substr(address.length - 4)}</label>}
        </div>
      </div>
    </div>
  );
};

const mapToStateProps = ({auth}) => ({
  user: auth.user
});

const mapToDispatchProps = (dispatch) => ({
  authSet: (payload) => dispatch(authSet(payload))
})
export default connect(mapToStateProps, mapToDispatchProps)(Connect);