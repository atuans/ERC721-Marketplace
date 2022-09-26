import React from 'react'
import { useMoralis, useMoralisQuery, useWeb3Contract} from "react-moralis";
import { Card, Button } from "web3uikit";
import Image from "next/image";
import { MarketAddress, MarketABI } from '../constants/constant';
import { nftContractAddress, nftContractAbi } from '../constants/constant';
import { useNotification } from 'web3uikit';

const MyAssets2 = () => {
  const { isWeb3Enabled, Moralis } = useMoralis();
  const dispatch = useNotification();
  const {runContractFunction} = useWeb3Contract();

  const currentAccount =  Moralis.account;

  const {data: listedNfts, isFetching: fetchingListedNfts} = useMoralisQuery("NFT",
  (query) => query.equalTo('seller', currentAccount));
 

  async function ApproveAndList(nftAddress,tokenId,price){
  console.log('Approving...');
    
  const approveOptions = {
      abi: nftContractAbi,
      contractAddress: nftAddress,
      functionName:'approve',
      params:{
        to: MarketAddress,
        tokenId:tokenId,
      },
    }

    await runContractFunction({ 
      params: approveOptions,
      onSuccess:() => handleApproveSuccess(nftAddress,tokenId,price),
      onError:(error) =>{
        console.log(error);
      },
    })
    console.log('Approve complete');
  }

  async function handleApproveSuccess(nftAddress,tokenId,price){
    console.log('Ok, now time to list');
    const listOptions = {
      abi: MarketABI,
      contractAddress: MarketAddress,
      functionName: "addItemToMarket",
      params:{
        nftAddress:nftAddress,
        tokenId: tokenId,
        price:price,
      },
    }

    await runContractFunction({
      params: listOptions,
      onSuccess: handleListSuccess,
      onError:(error) => console.log(error),
    })
  }

  async function handleListSuccess(){
    dispatch({
      type:"success",
      message:"NFT Listing",
      title:"NFT Listed",
      position:"topR"
    })
  }


  return (
 <div>
   <div className="container mx-auto">
              <h1 className="py-4 px-4 font-bold text-2xl">Your NFTs</h1>

             <div className="flex flex-wrap">               
                {isWeb3Enabled ? (
                     fetchingListedNfts ? (
                         <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => { 
                            const { nftName,price, nftAddress, tokenId, description,src} =
                                nft.attributes
                            return (
                          <div>
                      <div>
                        <div>
                          <div className="flex flex-col">
                            <Card title={nftName} description={description}>
                              <div className="p-2 h-[300px] w-[350px] rounded-3xl flex cursor-pointer transition-all duration-300  hover:scale-105 hover:shadow-xl overflow-hidden border border-black shadow-xl border-4 border-[#0193fb]">
                                <div className="flex flex-col items-end gap-2">
                                  <div>
                                     TokenID:{tokenId}
                                     <br/>
                                     Price:{price}
                                  </div>

                                  <div className="italic text-sm">
                                    NFT Address : {nftAddress}
                                  </div>

                                  <Image src={src} height="200" width="200" />
                                  <div className="font-bold"></div>
                                </div>
                              </div>
                            </Card>
                            <Button
                              color="green"
                              onClick={()=>ApproveAndList(nftAddress,tokenId,price)}
                              
                              size="large"
                              text="Sell Your NFT"
                              theme="colored"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div> 
      
    </div>


  )
}

export default MyAssets2