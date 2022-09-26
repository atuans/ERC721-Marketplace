import React from 'react'
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTCard from "../components/NFTCard"


export default function Home() {
  const { isWeb3Enabled, Moralis } = useMoralis()

   const {data: listedNfts, isFetching: fetchingListedNfts} = useMoralisQuery(
     "ItemForSales",(query) => query.limit(10).descending('tokenId')
   )

   const loadItemForSales = async() =>{
    const items = await Moralis.Cloud.run("getItems");
    console.log(items);
   }
   return (
    <div>
   <div className="container mx-auto">
              <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
             <div className="flex flex-wrap">               
                {isWeb3Enabled ? (
                     fetchingListedNfts ? (
                         <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => {
                            //console.log(nft.attributes)
                            const { price, nftAddress, tokenId, marketplaceAddress, seller,src} =
                                nft.attributes
                            return (
                                <div>
                                    <button onClick={loadItemForSales}>Click</button>
                          
                                    <NFTCard
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        src={src}
                                        key={`${nftAddress}${tokenId}`}

                                    />
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