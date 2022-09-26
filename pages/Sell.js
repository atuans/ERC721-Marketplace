import React, { useState } from 'react'
import { useMoralis, useWeb3Contract, useNewMoralisObject, useMoralisQuery, useMoralisCloudFunction } from "react-moralis";
import { nftContractAbi, nftContractAddress } from "../constants/constant";
import { useRouter } from "next/router";
import { ethers } from 'ethers';
import { Card, Button } from "web3uikit";


    // today apply triggers


const Sell = () => {
    const {Moralis,isInitialized } = useMoralis();
    const { save } = useNewMoralisObject("NFT");
    const [price,setPrice] = useState([]);
    const router = useRouter();
    // condition to get The ObjectId

    const NFT = Moralis.Object.extend('NFT');
                                           

    const handleSell = async () =>{
      const data = {
        price:ethers.utils.parseUnits(price,'ether').toString()
      };
      save(data,{
        onSuccess:() =>{
          alert('Success');
          router.push('/');

        },
        onError:(error)=>{
          alert('failed with error: ' + error); 
        }
      })

    }

  return (
    <div>
      <div>
          <div className="flex flex-col">

          <Card>
            <div className="p-2 h-[300px] w-[350px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden border border-black shadow-xl border-4 border-[#0193fb]">
              <div className="flex flex-col items-end gap-2">
                <div>
                   {/* #{tokenId} */}
                </div>
                <div className="italic text-sm">
                  <br />
                </div>
                <div className="italic text-sm">
                  {/* NFT Address : {nftAddress} */}
                </div>
                <input
                  value={price}
                  placeholder="Asset Price in Eth"
                  className="mt-2 border rounded p-4"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
            onClick={handleSell}
            text="Button"
          />
          </Card>    

        </div>
      </div>
    </div>
    


  )
}

export default Sell


