
const { ethers, run, network } = require("hardhat");
const {verify} = require('../utils/verify')
const hre = require("hardhat");

 
async function NFTV2Deploy(){
  const NFTV2 = await hre.ethers.getContractFactory('NFTV2');
  const nft2 = await NFTV2.deploy();
  await nft2.deployed();
  console.log(`Contract deployed to ${nft2.address}`);
  console.log(network.config);

  // where the JSON-RPC link and where the private key

  // So, whenever we run a scripts or a deploy test in hardhat, it default we are using hardhat network
  //in this case, is hardhat fake network, similar to ganache, because in hardhat.config.js, we still not define the network we want to deploy
 
  if(network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY){
    await nft2.deployTransaction.wait(1);
    await verify(nft2.address,[]);
  }

  //interact with the contract 
  // till now, the contract get verified
}



NFTV2Deploy()  
  .then(() => process.exit(0))
  .catch((error) =>{
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    process.exit(1);
  });