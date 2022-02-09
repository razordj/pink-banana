import React, { useEffect, useState } from "react";
import styles from "./collection.module.sass";
import FileBase64 from "react-file-base64";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import Web3Init from "../InitWeb3";
import { newCollection } from "../../store/actions/collection";
const dispatch = useDispatch;

const CreateCollect = () => {


    const [selectedImage, setSelectedImage] = useState();
    const [cName, setCName] = useState('');
    const [cDes, setCDes] = useState('');
    const [author, setAuthor] = useState('');

    const changeImage = (base64) => {
        setSelectedImage(base64);
    };

    const uploadNewCollection = () => {
        newCollection(cName, selectedImage, cDes, author)(dispatch);
        alert("Successfully Uploaded");
        window.location.reload();
    }

    useEffect(async () => {
        const web3 = await Web3Init();
        const accounts = await web3.eth.getAccounts();
        setAuthor(accounts[0]);
    }, []);

    return (
        <div className={`${styles.MainCollect}`}>
            <div className={styles.ImgPart}>
                <label>Cover Image:</label>
                {selectedImage ? <img src={selectedImage} className={styles.view_img} alt="Please select cover img" /> : null}
                <FileBase64
                    className={styles.load}
                    multiple={false}
                    onDone={({ base64 }) => changeImage(base64)}
                    type="file"
                />
            </div>
            <div className={styles.NamePart}>
                <label>Collection Name: </label>
                <input type={'text'} className={styles.cNameInput} onChange={(e) => setCName(e.target.value)} placeholder="Collection Name" />
            </div>
            <div className={styles.NamePart}>
                <label>Description: </label>
                <textarea className={styles.cDesInput} onChange={(e) => setCDes(e.target.value)} placeholder="Collection's Description" />
            </div>
            <div className={styles.sPart}>
                <button type="button" className={styles.sButton} onClick={() => { uploadNewCollection() }}>Submit</button>
            </div>
        </div>
    )
}

export default CreateCollect;