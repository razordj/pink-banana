import axios from "axios";

export const findOne = (address) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/v1/users/findOne",
      {
        address: address,
      }
    );
    return data;
  } catch (error) {
    return [];
  }
};

export const createUser =
  (address, username, customeUrl, selectedImage, bio, twitter, websiteURL) =>
  async (dispatch) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/users/create",
        {
          address: address,
          username: username,
          customURL: customeUrl,
          userBio: bio,
          websiteURL: websiteURL,
          twitter: twitter,
          userImg: selectedImage,
        }
      );
      return data;
    } catch (error) {
      return [];
    }
  };

export const updateById =
  (id, username, customeUrl, selectedImage, bio, twitter, websiteURL) =>
  async (dispatch) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/users/update_user",
        {
          id: id,
          username: username,
          customURL: customeUrl,
          websiteURL: websiteURL,
          userBio: bio,
          twitter: twitter,
          userImg: selectedImage,
        }
      );
      return data;
    } catch (error) {
      return [];
    }
  };
