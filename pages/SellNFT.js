import React, { useState } from "react";
import { MarketABI, MarketAddress } from "../constants/constant";
import { useNewMoralisObject } from "react-moralis";
import {
  useMoralis,
  
} from "react-moralis";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Form, useNotification, Button } from "web3uikit"

const NFT = () => {

  const { Moralis } = useMoralis();
  const router = useRouter();

  const { save } = useNewMoralisObject("NFT");
  const [nftName, setNftName] = useState([]);
  const [tokenId, setTokenId] = useState([]);
  const [price, setPrice] = useState([]);
  const [src, setSrc] = useState([]);
  const account = Moralis.account;

  const dispatch = useNotification()


  const saveObject = async () => {
    const data = {
      nftName: nftName,
      tokenId: tokenId,
      price: ethers.utils.parseUnits(price, "ether").toString(),
      src: src,
      seller: account,
    };
    save(data, {
      onSuccess: () => {
        alert("New object created");
        router.push("/");
      },
      onError: (error) => {
        alert("Failed to create new object, with error code: " + error.message);
      },
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <h3> Upload Your NFTs</h3>
        <input
          value={nftName}
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) => setNftName(e.target.value)}
          required
        />
        <input
          value={tokenId}
          placeholder="Token ID"
          className="mt-8 border rounded p-4"
          onChange={(e) => setTokenId(e.target.value)}
          required
        />
        <textarea
          value={src}
          placeholder="Asset SRC"
          className="mt-2 border rounded p-4"
          onChange={(e) => setSrc(e.target.value)}
          required
        />
        <input
          value={price}
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button
          onClick={saveObject}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  );
};

export default NFT;

/*


*/
