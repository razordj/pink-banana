import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./collection.module.sass";
import Icon from "../../../components/Icon";
import Modal from "../../../components/Modal";
import CreateCollect from "../../../components/CreateCollect";

const Collection = ({ className, items }) => {

    const [mVisible, setMVisible] = useState(false);

    return (
        <div className={(className, styles.cards)}>
            {items.map((x, index) => (
                <div className={styles.card} key={index} onClick={() => { setMVisible(true) }}>
                    <div className={styles.plus} style={{ backgroundColor: x.color }}>
                        <Icon name="plus" size="24" />
                    </div>
                    <div className={styles.subtitle}>{x.title}</div>
                </div>
            ))}
            <Modal visible={mVisible} onClose={() => { setMVisible(false) }}>
                <CreateCollect />
            </Modal>
        </div>
    );
};

export default Collection;
