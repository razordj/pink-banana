import React, { useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { FacebookShareButton, TwitterShareButton } from "react-share";
// import { isStepDivisible } from "react-range/lib/utils";
import web3 from "../../../components/InitWeb3";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { findOne } from "../../../store/actions/user.action";
const dispatch = useDispatch;

const shareUrlFacebook = "https://ui8.net";
const shareUrlTwitter = "https://ui8.net";

const User = ({ className, item }) => {
  const [visibleShare, setVisibleShare] = useState(false);
  const [visibleModalReport, setVisibleModalReport] = useState(false);
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState([]);

  useState(async () => {
    if (window.ethereum != null) {
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (data) => {
          if (data[0]) {
            setAddress(data[0]);
            const userData = await findOne(data[0])(dispatch);
            setUserData(userData);
          }
        });
    }
  }, [item]);

  return (
    <>
      <div className={cn(styles.user, className)}>
        <div className={styles.avatar}>
          {userData.profilePhoto ? (
            <img src={userData.userImg} alt="Avatar" />
          ) : (
            <img src="/images/content/main_avatar.png" alt="Avatar" />
          )}
        </div>
        <div className={styles.name}>
          {userData.username ? userData.username : "hero"}
        </div>
        <div className={styles.code}>
          <div className={styles.number}>{`${address.slice(
            0,
            8
          )} . . . ${address.slice(-3)}`}</div>
          <button className={styles.copy}>
            <Icon name="copy" size="16" />
          </button>
        </div>
        <div className={styles.info}>
          {/* A wholesome farm owner in Montana. Upcoming gallery solo show in
          Germany */}
          {userData.userBio}
        </div>
        {userData.websiteURL ? (
          <a
            className={styles.site}
            href={`${userData.websiteURL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="globe" size="16" />
            <span>{userData.websiteURL}</span>
          </a>
        ) : (
          <a
            className={styles.site}
            href="https://ui8.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="globe" size="16" />
            <span>https://ui8.net</span>
          </a>
        )}
        <div className={styles.control}>
          <div className={styles.btns}>
            {/* <button
              className={cn(
                "button button-small",
                { [styles.active]: visible },
                styles.button
              )}
              onClick={() => setVisible(!visible)}
            >
              <span>Follow</span>
              <span>Unfollow</span>
            </button> */}
            <button
              className={cn(
                "button-circle-stroke button-small",
                { [styles.active]: visibleShare },
                styles.button
              )}
              onClick={() => setVisibleShare(!visibleShare)}
            >
              <Icon name="share" size="20" />
            </button>
            <button
              className={cn("button-circle-stroke button-small", styles.button)}
              onClick={() => setVisibleModalReport(true)}
            >
              <Icon name="report" size="20" />
            </button>
          </div>
          <div className={cn(styles.box, { [styles.active]: visibleShare })}>
            <div className={styles.stage}>Share link to this page</div>
            <div className={styles.share}>
              <TwitterShareButton
                className={styles.direction}
                url={shareUrlTwitter}
              >
                <span>
                  <Icon name="twitter" size="20" />
                </span>
              </TwitterShareButton>
              <FacebookShareButton
                className={styles.direction}
                url={shareUrlFacebook}
              >
                <span>
                  <Icon name="facebook" size="20" />
                </span>
              </FacebookShareButton>
            </div>
          </div>
        </div>
        <div className={styles.socials}>
          {item.map((x, index) => (
            <a
              className={styles.social}
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <Icon name={x.title} size="20" />
            </a>
          ))}
        </div>
        <div className={styles.note}>Member since Jan 26, 2022</div>
      </div>
      <Modal
        visible={visibleModalReport}
        onClose={() => setVisibleModalReport(false)}
      >
        <Report />
      </Modal>
    </>
  );
};

const mapToStateProps = ({ auth }) => ({
  user: auth.iser,
});

const mapToDispatchProps = (dispatch) => ({
  user: (payload) => dispatch(findOne(payload)),
});

export default connect(mapToStateProps, mapToDispatchProps)(User);
