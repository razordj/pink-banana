import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
import Notification from "./Notification";
import User from "./User";
import { connect } from "react-redux";
import { authLogout, authSet } from "../../store/actions/auth.actions";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import Web3 from "web3";

const nav = [
  {
    url: "/marketCollect",
    title: "Discover",
  },
  {
    url: "/faq",
    title: "How it work",
  },

  // {
  //   url: "/",
  //   title: "Whitepaper",
  // },
  // {
  //   url: "/",
  //   title: "Why LOFI",
  // },
  // {
  //   url: "/",
  //   title: "Tokennomics",
  // },
  // {
  //   url: "/",
  //   title: "Roadmap",
  // },
  // {
  //   url: "/",
  //   title: "Team",
  // },
  // {
  //   url: "/",
  //   title: "Merch",
  // },
  // {
  //   url: "/",
  //   title: "EN",
  // },

  // {
  //   url: "/item",
  //   title: "Create item",
  // },
  // {
  //   url: "/profile",
  //   title: "Profile",
  // },
];

const Headers = (props) => {
  const [visibleNav, setVisibleNav] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  const [chainId, setChainId] = useState(0);
  const [configNetworkId, setConfigNetworkId] = useState(0);
  let [web3, setWeb3] = useState({});
  const [propsUser, setPropsUser] = useState({}); 

  useEffect(async () => {  
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

    if (metamaskIsInstalled) { 
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (data) => { //console.log("userser", data)
          setUser(data[0]);
        });
        const WEB3 = new Web3(window.ethereum);
        setWeb3(WEB3);

        const networkId = await ethereum.request({
          method: "net_version",
        }); 
        setConfigNetworkId(CONFIG.NETWORK.ID)
        setChainId(networkId);
        if (networkId == CONFIG.NETWORK.ID) {
          await props.authSet(WEB3);
          setPropsUser(Object.keys(props.user).length);
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => { 
            setUser(accounts[0]);
            window.location.reload();
          });
          // Add listeners end
        } else { 
          toast.error(`Change network to ${CONFIG.NETWORK.NAME}`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          
        }
        ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } catch (err) {
        toast.error("Something went wrong.", {
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

  }, [propsUser]);
  
  const handleSubmit = (e) => {
    alert();
  };

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
    <header className={styles.header}>
      <a
        target="_blank"
        rel="noreferrer"
      >
        <ToastContainer />
      </a>
      <div className={cn("container", styles.container)}>
        <Link className={styles.logo} to="/">
          <Image
            className={styles.pic}
            src="/images/logo-light.png"
            srcDark="/images/logo-light.png"
            alt="BlockFox"
          />
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>          
          <nav className={styles.nav}>
            {nav.map((x, index) => (
              <Link
                className={styles.link}
                // activeClassName={styles.active}
                to={x.url}
                key={index}
              >
                {x.title}
              </Link>              
            ))}
          </nav>
          <Link
            className={cn("button-small", styles.button)}
            to="/upload-variants"
          >
            Upload
          </Link>
        </div>
        <Notification className={styles.notification} />
        <Link
          className={cn("button-small", styles.button)}
          to="/upload-variants"
        >
          Upload
        </Link>
        {!Object.keys(user).length ?
          <p
            className={cn("button-stroke button-small", styles.button)}
            onClick={connectWallet}
          >
            Connect Wallet
          </p>
          : chainId == configNetworkId ? 
            <User className={styles.user} user={user} logout={() => props.authLogout()} /> : 
            <a
              className={cn("button-stroke button-small", styles.button)}
            >
              Connected
            </a>           
        }
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
    </header>
  );
};

const mapToStateProps = ({ auth }) => ({
  user: auth.user
})

const mapToDispatchProps = dispatch => ({
  authLogout: () => dispatch(authLogout()),
  authSet: (payload) => dispatch(authSet(payload))
})
export default connect(mapToStateProps, mapToDispatchProps)(Headers);
