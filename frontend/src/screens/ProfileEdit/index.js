import React, { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./ProfileEdit.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import Icon from "../../components/Icon";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import FileBase64 from "react-file-base64";
import {
  createUser,
  findOne,
  updateById,
} from "../../store/actions/user.action";

const dispatch = useDispatch;

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Edit Profile",
  },
];

const ProfileEdit = () => {
  const [address, setAddress] = useState("");
  const [userData, setUserData] = useState([]);
  const [userImg, setUserImg] = useState();
  const [username, setUserName] = useState("");
  const [customeUrl, setCustomUrl] = useState("");
  const [userBio, setUserBio] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [twitter, setTwitter] = useState("");
  const changeImage = (base64) => {
    // if (e.target.files && e.target.files.length > 0) {
    // }
    setUserImg(base64);
  };
  const clearAll = (e) => {
    setUserImg();
  };

  useState(async () => {
    if (window.ethereum != null) {
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (data) => {
          if (data[0]) {
            setAddress(data[0]);
            const userData = await findOne(data[0])(dispatch); console.log("userData", userData)
            if (userData) {
              setCustomUrl(userData.customURL);
              setWebsiteURL(userData.websiteURL);
              setUserName(userData.username);
              setUserBio(userData.userBio);
              setTwitter(userData.twitter);
              setUserImg(userData.userImg);
            }
            setUserData(userData);
          }
        });
    }
  }, []);
  
  const uploadUser = async () => { 
    if (userData._id) { console.log("updateDatafinixhed", address, username, customeUrl, userImg, userBio, twitter, websiteURL)
      updateById(
        userData._id,
        username,
        customeUrl,
        userImg,
        userBio,
        twitter,
        websiteURL
      )(dispatch);
    } else { console.log("createDatafinixhed", address, username, customeUrl, userImg, userBio, twitter, websiteURL)
      createUser(
        address,
        username,
        customeUrl,
        userImg,
        userBio,
        twitter,
        websiteURL
      )(dispatch);
    }
  };

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Edit profile</h1>
            <div className={styles.info}>
              You can set preferred display name, create{" "}
              <strong>your profile URL</strong> and manage other personal
              settings.
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  {userImg && <img src={userImg} alt="Avatar" />}
                  {!userImg && (
                    <img src="/images/content/main_avatar.png" alt="Avatar" />
                  )}
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.text}>
                    We recommend an image of at least 400x400. Gifs work too{" "}
                    <span role="img" aria-label="hooray">
                      🙌
                    </span>
                  </div>
                  <div className={styles.file}>
                    {/* <button
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                    >
                      Upload
                    </button> */}

                    <FileBase64
                      className={styles.load}
                      multiple={false}
                      onDone={({ base64 }) => changeImage(base64)}
                      type="file"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Account info</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="display name"
                      name="Name"
                      type="text"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your display name"
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="Custom url"
                      name="Url"
                      type="text"
                      value={customeUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="ui8.net/Your custom URL"
                      required
                    />
                    <TextArea
                      className={styles.field}
                      label="userBio"
                      name="userBio"
                      value={userBio}
                      onChange={(e) => setUserBio(e.target.value)}
                      placeholder="About yourselt in a few words"
                      required="required"
                    />
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Social</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="websiteURL or website"
                      name="websiteURLo"
                      type="text"
                      value={websiteURL}
                      onChange={(e) => setWebsiteURL(e.target.value)}
                      placeholder="Enter URL"
                      required
                    />
                    <div className={styles.box}>
                      <TextInput
                        className={styles.field}
                        label="twitter"
                        name="Twitter"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        type="text"
                        placeholder="@twitter username"
                        required
                      />
                      <button
                        className={cn(
                          "button-stroke button-small",
                          styles.button
                        )}
                      >
                        Verify account
                      </button>
                    </div>
                  </div>
                  <button
                    className={cn("button-stroke button-small", styles.button)}
                  >
                    <Icon name="plus-circle" size="16" />
                    <span>Add more social account</span>
                  </button>
                </div>
              </div>
              <div className={styles.note}>
                To update your settings you should sign message through your
                wallet. Click 'Update profile' then sign the message
              </div>
              <div className={styles.btns}>
                <button
                  className={cn("button", styles.button)}
                  onClick={() => uploadUser()}
                >
                  Update Profile
                </button>
                <button className={styles.clear} onClick={clearAll}>
                  <Icon name="circle-close" size="24" />
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToStateProps = ({ auth }) => ({
  user: auth.user,
});

const mapToDispatchProps = (dispatch) => ({
  user: (payload) => dispatch(findOne(payload)),
});

export default connect(mapToStateProps, mapToDispatchProps)(ProfileEdit);
