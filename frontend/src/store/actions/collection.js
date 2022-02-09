import axios from 'axios';


export const newCollection = (name, image, description, author) => async (dispatch) => {
    const { data } = await axios.post("http://localhost:5000/api/v1/collect/newCollect", {
        name: name,
        image: image,
        description: description,
        author: author
    });

    return data;
}

export const getCollections = async () => {
    const { data } = await axios.post("http://localhost:5000/api/v1/collect/", {
    });
    return data;
}


export const getCollectionOne = async (name) => {
    const { data } = await axios.post("http://localhost:5000/api/v1/collect/findOne", {
        name: name
    });
    return data;
}