module.exports = (mongoose) => {
  const Bid = mongoose.model(
    "Bid",
    mongoose.Schema(
      {
        nftId: String,
        bidNum: Number,
        bidPrice: Number,
        bidAddress: String,
        bidApprove: Boolean,
        bidApprovePrice: Number,
      },
      { timestamps: true }
    )
  );

  return Bid;
};
