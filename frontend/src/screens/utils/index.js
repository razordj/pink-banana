import { getCollectionOne, getCollections } from "../../store/actions/collection";


export const collectinNames = (filterItem) => {
    var cNames = [];

    filterItem.map((item) => {
        cNames.push(item.photoCollect);
    });


    for (let i = 0; i < cNames.length - 1; i++) {
        for (let j = i + 1; j < cNames.length; j++) {
            if (cNames[j] === 0) {
                continue;
            }
            if (cNames[i] === cNames[j]) {
                cNames[j] = 0;
            }
        }
    }

    var rNames = [];

    for (let i = 0; i < cNames.length; i++) {
        if (cNames[i] !== 0) {
            rNames.push(cNames[i]);
        }
    }
    return rNames;
}

export const getCollectData = async (cNames) => {

    var res = [];
    const cData = await getCollections();


    for (let i = 0; i < cData.length; i++) {
        for (let j = 0; j < cNames.length; j++) {
            if (cData[i].name === cNames[j]) {
                res.push(cData[i]);
            }
        }
    }

    return res;
}

export const getAllCollectData = async () => {
    const cData = await getCollections();
    return cData;
}

export const viewCollectData = (collecData) => {
    var resData = [];
    collecData.map((item) => {
        var resItem = {};
        resItem.title = item.name;
        resItem.author = item.author;
        resItem.avatar = item.image;
        resItem.gallery = [item.image,
        ];
        resItem.counter = 28;
        resData.push(resItem);
    })
    return resData;
}