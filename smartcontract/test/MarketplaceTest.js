const {expect} = require("chai");
const { ethers, run, network } = require("hardhat");

describe("Marketplace", function(){
    it("Should create and execute market sales", async ()=>{
        const Marketplace = await ethers.getContractFactory("Marketplace");
        const marketplace = await Marketplace.deploy();
        await marketplace.deployed();

        const marketplaceAddress = marketplace.address
        console.log(`Contract deployed to ${marketplaceAddress}`);

        // interact with contract
        // we will get the listing price

        let listingPrice = await marketplace.getListingPrice();
        listingPrice = listingPrice.toString(); // we need string format

        const auctionPrice = ethers.utils.parseUnits('1','ether');

       
        /* sample 2 test token*/
        await marketplace.createToken("https://www.mytokenlocation.com", auctionPrice,{value:listingPrice});
        await marketplace.createToken("https://wwww.mytokenlocation2.com", auctionPrice,{value:listingPrice});

        const[_,buyerAddress] = await ethers.getSigners();
        // underscores ( _ ) means ignore

        // execute sell token for another user
        await marketplace.connect(buyerAddress).createMarketSale(1,{value: auctionPrice})
        // in this case buyerAddress become the provider or signer
        //By passing in a Provider, this will return a downgraded Contract which only has read-only access (i.e. constant calls).
        //By passing in a Signer. this will return a Contract which will act on behalf of that signer.

        // what we done here is created 2 nft and placed it on marketplace for sale

        let items = await marketplace.fetchMarketItems();
        items = await Promise.all(items.map(async i =>{
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            let item = {
                price: i.price.toString(),
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                owner: i.owner,
                tokenUri
            }
            return item
        }))
        console.log('items:',items);
    })
})