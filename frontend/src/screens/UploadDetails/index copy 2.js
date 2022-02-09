import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-redux';
import cn from "classnames";
import styles from "./UploadDetails.module.sass";
import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import Cards from "./Cards";
import FolowSteps from "./FolowSteps";
// import ipfs from "../../components/ipfs";
import { uploadCreate } from '../../store/actions/upload';
import Web3 from "web3";
import {connect} from "react-redux";
import axios from 'axios';
import { authSet } from "../../store/actions/auth.actions";

import {create} from "ipfs-http-client"


const royaltiesOptions = ["10%", "20%", "30%"];

const items = [
  {
    title: "Create collection",
    color: "#4BC9F0",
  },
  {
    title: "Crypto Legend - Professor",
    color: "#45B26B",
  },
  {
    title: "Crypto Legend - Professor",
    color: "#EF466F",
  },
  {
    title: "Legend Photography",
    color: "#9757D7",
  },
];

const Upload = (props) => {
  const [royalties, setRoyalties] = useState(royaltiesOptions[0]);
  const [sale, setSale] = useState(true);
  const [price, setPrice] = useState(false);
  const [locking, setLocking] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);

  const [visiblePreview, setVisiblePreview] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemSize, setItemSize] = useState('');
  const [itemProperty, setItemProperty] = useState('');
  const [previewImage, setPreviewImage] = useState();
  const [imgUploadState, setImgUploadState] = useState(false);
  const [hashValue, setHashValue] = useState();

  const dispatch = useDispatch();
  let [web3, setWeb3] = useState({});
  const [address, setAddress] = useState('');
  
  //
  const [multiaddr, setMultiaddr] = useState('http://localhost:5001')
  const [error, setError] = useState(null)
  const [ipfs, setIpfs] = useState(null)
  const [version, setVersion] = useState(null)
  const [id, setId] = useState(null)

  const [selectFile, setSelectedFile] = useState(null)
  //

  useEffect(async () => {
    if(window.ethereum != null && Object.keys(props.user).length) {
      await window.ethereum.request({method: 'eth_requestAccounts'}).then(async (data) => {
        setAddress(data[0]);
      })
    }
    else {
      setAddress('');
    }
  },[props])

  // useEffect(async () => {
  //   if (!ipfs) return;

  //   const getVersion = async () => {
  //     const nodeId = await ipfs.version();
  //     setVersion(nodeId);
  //   }

  //   const getId = async () => {
  //     const nodeId = await ipfs.id();
  //     setId(nodeId);
  //   }

  //   getVersion();
  //   getId();
  // }, [ipfs])

  useEffect(async () => {
    await connect();
  }, [])
  
  const connect = async () => {
    try {
      const http = create({ host: 'localhost', port: '5001', protocol: 'http' })
     
      const { cid } = await http.add('Hello world!')
      // const isOnline = await http.isOnline()

      // if (isOnline) {
      if (http) {
        setIpfs(http)
        setError(null)
      }
    }
    catch(err) {
      setError(err.message)
    }
  }

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(e.target.files[0]);
      reader.onloadend = () => {
        setSelectedImage(Buffer(reader.result));
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
        setSelectedFile(e.target.files[0]);
      }
    }
  }

  const changeItemName = (e) => {
    setItemName(e.target.value);
  }

  const removeAll = () => {
    setSelectedImage();
    setItemName();
  }

  const saveToIpfs = async ([file]) => {
    try {
      const added = await ipfs.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )

      setHashValue(added.cid.toString())
      setImgUploadState(true);
    } catch (err) {
      setError(err.message)
    }
  }
  
  const createItem = (e) => {
    setVisibleModal(true);
    if (!selectedImage) return;

    saveToIpfs(selectedImage);
    // ipfs.files.add(selectedImage, (err, result) => {
    //   console.log("IPFS: ", err, result);
    //   if(!err) {
    //     console.log("IPFS: ", err);
    //     return false;        
    //   } 

    //   setHashValue(result);
    //   setImgUploadState(true);
    //   });

      e.preventDefault();
      uploadCreate(address, itemName,itemDesc,itemSize,itemProperty,royalties,price,locking)(dispatch);
     }
    return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn("h2", styles.title)}>
                Create single NFT
              </div>
              <button
                className={cn("button-stroke button-small", styles.button)}
              >
                Switch to Multiple
              </button>
            </div>
            <form className={styles.form} action="">
                <div className={styles.list}>
                  <div className={styles.item}>
                    <div className={styles.category}>Upload file</div>
                    <div className={styles.note}>
                      Drag or choose your file to upload
                    </div>
                    <div className={styles.file}>
                      <input onChange={imageChange} className={styles.load} type="file" />
                      <div className={styles.icon}>
                        <Icon name="upload-file" size="24" />
                      </div>
                      <div className={styles.format}>
                        PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                      </div>
                    </div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.category}>Item Details</div>
                    <div className={styles.fieldset}>
                      <TextInput
                        className={styles.field}
                        label="Item name"
                        name="Item"
                        type="text"
                        placeholder='e. g. Redeemable Bitcoin Card with logo"'
                        onChange = {changeItemName}
                        required
                      />
                      <TextInput
                        className={styles.field}
                        label="Description"
                        name="Description"
                        type="text"
                        placeholder="e. g. “After purchasing you will able to recived the logo...”"
                        value={itemDesc}
                        onChange={(e) => setItemDesc(e.target.value)}
                        required
                      />
                      <div className={styles.row}>
                        <div className={styles.col}>
                          <div className={styles.field}>
                            <div className={styles.label}>Royalties</div>
                            <Dropdown
                              className={styles.dropdown}
                              value={royalties}
                              setValue={setRoyalties}
                              options={royaltiesOptions}
                            />
                          </div>
                        </div>
                        <div className={styles.col}>
                          <TextInput
                            className={styles.field}
                            label="Size"
                            name="Size"
                            type="text"
                            placeholder="e. g. Quantity"
                            onChange={(e) => setItemSize(e.target.value)}
                            required
                          />
                        </div>
                        <div className={styles.col}>
                          <TextInput
                            className={styles.field}
                            label="Properties"
                            name="Properties"
                            type="text"
                            placeholder="e. g. Properties"
                            onChange={(e) => setItemProperty(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.options}>
                  <div className={styles.option}>
                    <div className={styles.box}>
                      <div className={styles.category}>Put on sale</div>
                      <div className={styles.text}>
                        You’ll receive bids on this item
                      </div>
                    </div>
                    <Switch value={sale} setValue={setSale} />
                  </div>
                  <div className={styles.option}>
                    <div className={styles.box}>
                      <div className={styles.category}>Instant sale price</div>
                      <div className={styles.text}>
                        Enter the price for which the item will be instantly sold
                      </div>
                    </div>
                    <Switch value={price} setValue={setPrice} />
                  </div>
                  <div className={styles.option}>
                    <div className={styles.box}>
                      <div className={styles.category}>Unlock once purchased</div>
                      <div className={styles.text}>
                        Content will be unlocked after successful transaction
                      </div>
                    </div>
                    <Switch value={locking} setValue={setLocking} />
                  </div>
                  {/*
                  <div className={styles.category}>Choose collection</div>
                  <div className={styles.text}>
                    Choose an exiting collection or create a new one
                  </div>
                  
                  <Cards className={styles.cards} items={items} />
                  */}
                </div>
                <div className={styles.foot}>
                  <button
                    className={cn("button-stroke tablet-show", styles.button)}
                    onClick={() => setVisiblePreview(true)}
                    type="button"
                  >
                    Preview
                  </button>

                  { ipfs &&
                    <button
                      className={cn("button", styles.button)}
                      onClick={createItem}
                      // type="button" hide after form customization
                      type="button"
                    >
                      <span>Create</span>
                      <Icon name="arrow-next" size="10" />
                    </button>
                  }
                  {/*}
                  <div className={styles.saving}>
                    <span>Auto saving</span>
                    <Loader className={styles.loader} />
                  </div>
                */}
                </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            imageData={previewImage}
            itemName={itemName}
            removeAll={removeAll}
            itemDesc={itemDesc}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps
          className={styles.steps}
          uploadState = {imgUploadState}
          hashValue = {hashValue}
          itemName={itemName}
          itemDesc={itemDesc}
        />
      </Modal>
    </>
  );
};

const mapToStateProps = ({auth}) => ({
  user: auth.user
});

const mapToDispatchProps = (dispatch) => ({
  authSet: (payload) => dispatch(authSet(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Upload);
