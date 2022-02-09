module.exports = (mongoose) => {
  const User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        address: String,
        username: String,
        customURL: String,
        profilePhoto: String,
        userBio: String,
        websiteURL: String,
        userImg: String,
      },
      { timestamps: true }
    )
  );

  return User;
};
