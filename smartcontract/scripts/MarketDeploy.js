
const { ethers, run, network } = require("hardhat");
const {verify} = require('../utils/verify')

 
async function MarketplaceDeploy(){
  const MarketplaceV4 = await ethers.getContractFactory('MarketplaceV4');
  const marketplacev4 = await MarketplaceV4.deploy();
  await marketplacev4.deployed();
  console.log(`Contract deployed to ${marketplacev4.address}`);
  console.log(network.config);

  // where the JSON-RPC link and where the private key

  // So, whenever we run a scripts or a deploy test in hardhat, it default we are using hardhat network
  //in this case, is hardhat fake network, similar to ganache, because in hardhat.config.js, we still not define the network we want to deploy
 
  if(network.config.chainId === 3 && process.env.ETHERSCAN_API_KEY){
    await marketplacev4.deployTransaction.wait(6);
    await verify(marketplacev4.address,[]);
  }

  //interact with the contract 
  // till now, the contract get verified
}



MarketplaceDeploy()  
  .then(() => process.exit(0))
  .catch((error) =>{
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    process.exit(1);
  });