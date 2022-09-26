import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract,useWeb3ExecuteFunction  } from "react-moralis";
import { nftContractAbi, nftContractAddress } from "../constants/constant";
import { useRouter } from "next/router";
import Moralis from "moralis";
import { ethers } from "ethers";
import Web3 from "web3";
import { MarketAddress, MarketABI } from "../constants/constant";
import {  useNotification } from "web3uikit"


const Mint = () => {
  const { isAuthenticated, user, Moralis } = useMoralis();
  const router = useRouter();
  const [name, setName] = useState("");
  const options = ['Not For Sale','Put on Sell'];
  const [status, setStatus] = useState(options[0]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState([]);
  const account = Moralis.account;
  const dispatch = useNotification()

  const {runContractFunction} = useWeb3Contract();

  const web3 = new Web3(Web3.givenProvider, {
    network: "goerli",
    cacheProvider: true,
  });

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      //save image to IPFS
      // generate metadata and save to IPFS
      // interact with smart contract
      const file1 = new Moralis.File(file.name, file);
      await file1.saveIPFS();
      const file1url = file1.ipfs();
      const filePath = file1.hash();

      console.log(file1url);
      const metadata = {
        name: name,
        description: description,
        image: file1url,
        filePath: filePath,
        status: status,
        price: ethers.utils.parseUnits(price, "ether").toString(),
      };

      //saving files
      const file2 = new Moralis.File(`${name}file.json`, {
        base64: btoa(JSON.stringify(metadata)),
      });

      const file2Path = file2.ipfs();
      const file2Hash = file2.hash();
      await file2.saveIPFS();
      const metadataURL = file2.ipfs();

      const contract = new web3.eth.Contract(
        nftContractAbi,
        nftContractAddress
      );
      const response = await contract.methods.mint(metadataURL).send({
        from: user.get("ethAddress"),
      });

      const tokenId = response.events.Transfer.returnValues.tokenId;
      console.log(tokenId, nftContractAddress);

      const NFT = new Moralis.Object.extend("NFT");
      const query = new Moralis.Query(NFT);
      query.equalTo("tokenId", tokenId);
      query.equalTo("nftAddress", nftContractAddress);
      query.equalTo("src", file1url);

      const alreadyMinted = await query.first();
      console.log(`Existed NFT ${JSON.stringify(alreadyMinted)}`);
      if (alreadyMinted) {
        await alreadyMinted.destroy();
        console.log(`NFT Destroy`);
      }
      const nft = new NFT();
      nft.set("nftName", name);
      nft.set("src", file1url);
      nft.set("tokenURI", metadataURL);
      nft.set("price", ethers.utils.parseEther(price).toString());
      nft.set("nftFilePath", file1url);
      nft.set("nftFileHash", filePath);
      nft.set("nftMetadataFilePath", file2Path);
      nft.set("nftMetadataFileHash", file2Hash);
      nft.set("tokenId", tokenId);
      nft.set("nftAddress", nftContractAddress);
      nft.set("Status", options[0]);
      nft.set("seller", account);
      nft.set("description", description);
      console.log("Saving NFT to database ...");
      console.log(nft);
      await nft.save();
      
      alert(
        `NFT minted successfully - Contract Address:${nftContractAddress} and tokenId : ${tokenId}`
      );
      router.push("/");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div>
      <div className="flew w-screen h-screen items-center justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <h3 className="py-4 px-4 font-bold text-3xl"> Mint Your NFTs</h3>
          <form onSubmit={onSubmit}>
            <div>
              <input
                value={name}
                placeholder="NFT Name"
                className="mt-8 border rounded p-4"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                value={description}
                placeholder="Description"
                className="mt-8 border rounded p-4"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <input
                value={price}
                placeholder="Price"
                className="mt-8 border rounded p-4"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="file"
                placeholder="File"
                className="mt-2 border rounded p-4"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <button
              type="submit"
              className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
            >
              Mint NFT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Mint;
