import React, { useState } from "react";
import cn from "classnames";
import styles from "./FolowSteps.module.sass";
import Icon from "../../../components/Icon";
import Loader from "../../../components/Loader";
import LoaderCircle from "../../../components/LoaderCircle";
import Web3Init from "../../../components/InitWeb3";
import PhotoFactory from "../../../ABI/PhotoNFTFactory.json";
import PhotoNFT from "../../../ABI/PhotoNFT.json";
import PhotoNFTMarketplace from "../../../ABI/PhotoNFTMarketplace.json";

const FolowSteps = ({ className, uploadState, hashValue, itemName, itemDesc, itemSize, itemCollection }) => {
  // const [uploadState, setUploadState] = useState(false);
  const [signState, setSignState] = useState(0);
  const [errorState, setErrorState] = useState(false);

  const mintNFT = async () => {
    setSignState(1);
    const web3 = await Web3Init();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PhotoFactory.networks[networkId.toString()];
    const PhotoNFTFactory = new web3.eth.Contract(
      PhotoFactory.abi,
      deployedNetwork && deployedNetwork.address
    )
    const accounts = await web3.eth.getAccounts();
    // const { nftName, nftDesc, hashValue } = props;
    const price = web3.utils.toWei("0", 'ether');
    let BN = web3.utils.BN;
    const fee = new BN(price);
    console.log(itemName, "CINDE", price, hashValue, itemDesc, itemSize, itemCollection);
    // PhotoNFTFactory.methods.createNewPhotoNFT(itemName, "CINDE", price, hashValue[0].hash, itemDesc)
    PhotoNFTFactory.methods.createNewPhotoNFT(itemName, price, hashValue, itemDesc, itemCollection, itemSize)
      .send({ from: accounts[0], fee: fee })
      .once("receipt", async (receipt) => {
        console.log(receipt.events.PhotoNFTCreated.length);
        const length = receipt.events.PhotoNFTCreated.length;

        if (length === undefined) {
          const PHOTO_NFT = receipt.events.PhotoNFTCreated.returnValues.photoNFT;
          let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
          photoNFT.methods.ownerOf(1).call().then(owner => {
          })
            .catch(err => {
              if (err) {
                setSignState(2);
              }
            });;
          if (PhotoNFTMarketplace.networks[networkId.toString()]) {
            const networks = PhotoNFTMarketplace.networks[networkId.toString()].address;
            photoNFT.methods.approve(networks, 1).send({ from: accounts[0] }).once('receipt', (receipt) => {
              setSignState(3);
              window.location.href = "#";
            })
              .catch(err => {
                if (err) {
                  setSignState(2);
                }
              });
          }
        }
        else {
          for (let i = 0; i < length; i++) {
            const PHOTO_NFT = receipt.events.PhotoNFTCreated[i].returnValues.photoNFT;
            let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
            await photoNFT.methods.ownerOf(1).call().then(owner => {
            })
              .catch(err => {
                if (err) {
                  setSignState(2);
                }
              });;
            if (PhotoNFTMarketplace.networks[networkId.toString()]) {
              const networks = PhotoNFTMarketplace.networks[networkId.toString()].address;
              await photoNFT.methods.approve(networks, 1).send({ from: accounts[0] }).once('receipt', (receipt) => {
                setSignState(3);
                window.location.href = "#";
              })
                .catch(err => {
                  if (err) {
                    setSignState(2);
                  }
                });
            }
            alert("Successfully completed!")
          }
        }
        // const PHOTO_NFT = receipt.events.PhotoNFTCreated.returnValues.photoNFT;
        // let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);
        // photoNFT.methods.ownerOf(1).call().then(owner => {
        // })
        //   .catch(err => {
        //     if (err) {
        //       setSignState(2);
        //     }
        //   });;
        // if (PhotoNFTMarketplace.networks[networkId.toString()]) {
        //   const networks = PhotoNFTMarketplace.networks[networkId.toString()].address;
        //   photoNFT.methods.approve(networks, 1).send({ from: accounts[0] }).once('receipt', (receipt) => {
        //     setSignState(3);
        //     alert("Successfully completed!")
        //     window.location.href = "#";
        //   })
        //     .catch(err => {
        //       if (err) {
        //         setSignState(2);
        //       }
        //     });
        // }
      })
      .catch(err => {
        if (err) {
          setSignState(2);
        }
      });
  }
  return (
    <div className={cn(className, styles.steps)}>
      <div className={cn("h4", styles.title)}>Folow steps</div>
      <div className={styles.list}>
        <div className={cn(styles.item, styles.done)} >
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="upload-file" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Upload files & Mint token</div>
              <div className={styles.text}>Call contract method</div>
            </div>
          </div>
          <button className={cn("button done", styles.button)}>
            {
              !uploadState ?
                <Loader className={styles.loader} color="white" />
                : "Done"
            }

          </button>
        </div>
        {
          !signState &&
          <div className={styles.item}>
            <div className={styles.head}>
              <div className={styles.icon}>
                <Icon name="pencil" size="24" />
              </div>
              <div className={styles.details}>
                <div className={styles.info}>Sign sell order</div>
                <div className={styles.text}>
                  Sign sell order using your wallet
                </div>
              </div>
            </div>
            <button onClick={mintNFT} className={cn(`button ${uploadState ? '' : "disabled"}`, styles.button)}>
              Start now
            </button>
          </div>
        }
        {
          signState == 1 &&
          <div className={styles.item}>
            <div className={styles.head}>
              <div className={styles.icon}>
                <LoaderCircle className={styles.loader} />
              </div>
              <div className={styles.details}>
                <div className={styles.info}>Sign sell order</div>
                <div className={styles.text}>
                  Sign sell order using your wallet
                </div>
              </div>
            </div>
            <button className={cn("button loading", styles.button)}>
              <Loader className={styles.loader} color="white" />
            </button>
          </div>
        }
        {
          signState == 2 &&
          <div className={cn(styles.item, styles.error)}>
            <div className={styles.head}>
              <div className={styles.icon}>
                <Icon name="pencil" size="24" />
              </div>
              <div className={styles.details}>
                <div className={styles.info}>Sign sell order</div>
                <div className={styles.text}>
                  Sign sell order using your wallet
                </div>
              </div>
            </div>
            <button className={cn("button error", styles.button)}>Failed</button>
          </div>
        }
        {
          signState == 3 &&
          <div className={styles.item}>
            <div className={styles.head}>
              <div className={styles.icon}>
                <Icon name="bag" size="24" />
              </div>
              <div className={styles.details}>
                <div className={styles.info}>Sign lock order</div>
                <div className={styles.text}>
                  Sign lock order using your wallet
                </div>
              </div>
            </div>
            <button className={cn("button", styles.button)}>Start now</button>
          </div>
        }
      </div>
      {
        errorState &&
        <div className={styles.note}>
          Something went wrong, please{" "}
          <a href="/#" target="_blank" rel="noopener noreferrer">
            try again
          </a>
        </div>
      }
    </div>
  );
};

export default FolowSteps;
