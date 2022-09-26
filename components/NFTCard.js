import React, { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis, useMoralisQuery } from "react-moralis";
import { MarketABI, MarketAddress, nftAbi } from "../constants/constant";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { Button, NFT } from "web3uikit";
import UpdatePrice from "./UpdatePrice";


const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

export default function NFTCard ({ price,nftAddress, nftName, tokenId, seller, src }){
  const { account } = useMoralis();
  const [image, setImage] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);
  const dispatch = useNotification();

    const {
    isAuthenticated,
    enableWeb3,
    user,
    Moralis,
    isWeb3Enabled,
  } = useMoralis()

    const {
    data: userData,
    error: userDataError,
    isLoading: userDataIsLoading,
  } = useMoralisQuery('_User')


  const isOwnedByUser = seller === account || seller === undefined;
  const formatSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);

    
    const buyNFTs = async (price, tokenId) => {

      console.log('price: ', price)
      console.log('tokenId:', tokenId);
      console.log('nftAddress:',nftAddress);
      console.log(userData);

      const options = {
        type:"erc721",
        receiver:MarketAddress,
        contractAddress:MarketAddress,
        amount:price,
        tokenId: tokenId,
      }
      let transaction = await Moralis.transfer(options);
      const receipt = await transaction.wait();

         if (receipt) {

        const res = userData[0]?.add('ownedAsset', {
          ...tokenId,
          purchaseDate: Date.now(),
          etherscanLink: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`,
        })

        await res.save().then(() => {
          alert("You've successfully purchased this asset!")
        })
      }
  } 

  return (
    <div>
      <div>
        <div className="flex flex-col">
               <UpdatePrice
                   isVisible={showModal}
                   nftAddress={nftAddress}
                  tokenId={tokenId}
                onClose={hideModal}
                  />
          <Card
            title={tokenName}
            description={tokenDescription}
             onClick={() =>buyNFTs(price, tokenId)}
          >
            <div className="p-2 h-[300px] w-[350px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden border border-black shadow-xl border-4 border-[#0193fb]">
              <div className="flex flex-col items-end gap-2">
                <div>
                  {nftName} : #{tokenId}
                </div>
                <div className="italic text-sm">
                  Owned : {formatSellerAddress}
                  <br />
                  Seller : {seller}
                </div>
                <div className="italic text-sm">
                  NFT Address : {nftAddress}
          
                </div>

                <Image src={src} height="200" width="200" />
                <div className="font-bold">
                  {/* {ethers.utils.formatUnits(price, "ether")} ETH */}
                </div>
              </div>

              
            </div>
 
          </Card>           <Button
              color="green"
              onClick={() =>buyNFTs(price,tokenId)}
              size="large"
              text="BUY"
              theme="colored"
            />
        </div>
      </div>
    </div>
  );
};


