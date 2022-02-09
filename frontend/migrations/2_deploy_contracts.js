const PhotoNFTData = artifacts.require("PhotoNFTData");
const PhotoNFTMarketplace = artifacts.require("PhotoNFTMarketplace");
const PhotoNFTFactory = artifacts.require("PhotoNFTFactory");
const PhotoNFTTradable = artifacts.require("PhotoNFTTradable");

var dataAddress = "";
var marketAddress = "";
var factoryAddress = "";
var trableAddress = "";

module.exports = async function (deployer) {
  await deployer.deploy(PhotoNFTData).then(()=>dataAddress=PhotoNFTData.address);
  await deployer.deploy(PhotoNFTMarketplace, dataAddress, "0xD180DEc4d12046b8D2D0bf6A338349cfea9236F1").then(()=>marketAddress = PhotoNFTMarketplace.address);
  await deployer.deploy(PhotoNFTFactory, marketAddress, dataAddress).then(()=>factoryAddress = PhotoNFTFactory.address);
  await deployer.deploy(PhotoNFTTradable, dataAddress).then(()=>trableAddress=PhotoNFTTradable.address);
  console.log("PhotoNFTData:",dataAddress, "PhotoNFTMarketplace:",marketAddress, "PhotoNFTFactory:",factoryAddress, "PhotoNFTTradable:", trableAddress);
};

