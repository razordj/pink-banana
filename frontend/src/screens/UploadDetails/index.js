import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataListInput from "react-datalist-input";
import { useSelector, useDispatch } from 'react-redux';
import cn from "classnames";
import styles from "./UploadDetails.module.sass";
import Dropdown from "../../components/Dropdown";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import Cards from "./Collection";
import FolowSteps from "./FolowSteps";
import ipfs from "../../components/ipfs";
import { uploadCreate } from '../../store/actions/upload';
import { connect } from "react-redux";
import { authSet } from "../../store/actions/auth.actions";
import { getCollections } from "../../store/actions/collection";
import { create } from 'ipfs-http-client';

/* Create an instance of the client */
// const client = ipfsHttpClient('https://localhost:5001/api/v0')
const client = create('https://ipfs.infura.io:5001/api/v0')

const royaltiesOptions = ["10%", "20%", "30%"];

const items = [
  {
    title: "Create collection",
    color: "#4BC9F0",
  },
];

const Upload = (props) => {
  const [royalties, setRoyalties] = useState(royaltiesOptions[0]);
  const [sale, setSale] = useState(true);
  const [price, setPrice] = useState(false);
  const [locking, setLocking] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);

  const [visiblePreview, setVisiblePreview] = useState(false);

  const [visibleCreateBtn, setVisibleCreateBtn] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemSize, setItemSize] = useState('');
  const [itemCollection, setItemCollection] = useState('');
  const [itemProperty, setItemProperty] = useState('');
  const [previewImage, setPreviewImage] = useState();
  const [imgUploadState, setImgUploadState] = useState(false);
  const [hashValue, setHashValue] = useState('');
  const [collectionItems, setCollectionItems] = useState([]);
  const [fileUrl, updateFileUrl] = useState(``)

  const dispatch = useDispatch();
  let [web3, setWeb3] = useState({});
  const [address, setAddress] = useState('');


  useEffect(async () => {
    const collections = await getCollections();
    const collectionItems = [];
    var count = 0;
    collections.map((item) => {
      var itemData = {};
      itemData.name = item.name;
      itemData.id = count;
      itemData.value = item.desciption;
      collectionItems.push(itemData);
      count++;
    })

    setCollectionItems(collectionItems);

    if (window.ethereum != null && Object.keys(props.user).length) {
      await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (data) => {
        setAddress(data[0]);
        console.log("=======================================================")
        console.log("address: ", data[0])
        console.log("address: ", data)
        console.log("address: ", address)
        console.log("=======================================================")
      })
    }
    else {
      setAddress('');
      console.log("address else part=============================")
    }
  }, [props])

  async function imageChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(e.target.files[0]);
      reader.onloadend = () => {
        setSelectedImage(Buffer(reader.result));
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
      }

      //== add ==
      const file = e.target.files[0];
      try {
        const added = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;

        updateFileUrl(url);

        setVisibleCreateBtn(true)

        setHashValue(`${added.path}`);
        setImgUploadState(true);

        console.log("=====================================")
        console.log("uploaded url: ", url)
        console.log("hashvalue: ", hashValue)
        console.log("=====================================")

      } catch (error) {
        console.log('Error uploading file: ', error)
      }
      //====================  
    }
  }

  const onSelect = useCallback(
    (selectedItem) => {
      setItemCollection(selectedItem.name);
    },
    [],
  );

  const cItems = useMemo(() => collectionItems.map((oneItem) => ({
    label: oneItem.name,
    key: oneItem.id,
    someAdditionalValue: oneItem.value,
    ...oneItem,
  })), [collectionItems]);

  const changeItemName = (e) => {
    setItemName(e.target.value);
  }

  const removeAll = () => {
    setSelectedImage();
    setItemName();
  }

  const createItem = (e) => {
    setVisibleModal(true);
    // ipfs.files.add(selectedImage, (err, result) => {
    //   if (!err) {
    //     return false;
    //   }
    //   setHashValue(result);
    //   setImgUploadState(true);
    // });


    console.log("=====================================")
    console.log("address: ", address)
    console.log("itemName: ", itemName)
    console.log("itemDesc: ", itemDesc)
    console.log("itemSize: ", itemSize)
    console.log("itemProperty: ", itemProperty)
    console.log("royalties: ", royalties)
    console.log("price: ", price)
    console.log("locking: ", locking)
    console.log("hashValue: ", hashValue)
    console.log("=====================================")

    e.preventDefault();
    // uploadCreate(address, itemName,itemDesc,itemSize,itemProperty,royalties,price,locking)(dispatch);
    uploadCreate(hashValue, address, itemName, itemDesc, itemSize, itemProperty, royalties, price, locking)(dispatch);
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
                    {
                      fileUrl && (
                        <img src={fileUrl} width="600px" />
                      )
                    }
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
                      onChange={changeItemName}
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

                <div className={styles.category}>Choose collection</div>
                <div className={styles.text}>
                  Choose an exiting collection or create a new one
                </div>

                <Cards className={styles.cards} items={items} />

                <DataListInput
                  placeholder={`Selecte Collection...`}
                  items={cItems}
                  onSelect={onSelect}
                  inputClassName={`${styles.collect}`}
                />
              </div>
              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
                <button
                  // className={cn("button", styles.button)}
                  className={cn(`button ${visibleCreateBtn ? '' : "disabled"}`, styles.button)}
                  onClick={createItem}
                  // type="button" hide after form customization
                  type="button"
                >
                  <span>Create</span>
                  <Icon name="arrow-next" size="10" />
                </button>
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
          uploadState={imgUploadState}
          hashValue={hashValue}
          itemName={itemName}
          itemDesc={itemDesc}
          itemSize={itemSize}
          itemCollection={itemCollection}
        />
      </Modal>
    </>
  );
};

const mapToStateProps = ({ auth }) => ({
  user: auth.user
});

const mapToDispatchProps = (dispatch) => ({
  authSet: (payload) => dispatch(authSet(payload))
})

export default connect(mapToStateProps, mapToDispatchProps)(Upload);
