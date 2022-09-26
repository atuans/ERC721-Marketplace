import React, { useEffect } from 'react'
import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useMoralis, useMoralisQuery, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { MarketABI,MarketAddress } from '../constants/constant'
import { useNewMoralisObject } from "react-moralis";
const UpdatePrice = ({ tokenId,isVisible,onClose,}) => {
    
    const {Moralis} = useMoralis()


    const dispatch = useNotification()
    const [price, setPrice] = useState(0)
    const { save } = useNewMoralisObject("NFT");

    const handleUpdate = async () => {
    const NFT = Moralis.Object.extend("NFT");
    const query = new Moralis.Query(NFT);
    const nft = await query.first();

    nft.set('price', ethers.utils.parseEther(price).toString());
    nft.save()
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated ",
            position: "topR",
        })
        onClose && onClose()
        setPrice("0")
    }
 

    const successAnnounce = async (tx) =>{
        console.log('Updated');    }


  return (
    <div>       

        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                handleUpdate({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: successAnnounce,
                })
            }}
        >

            <Input
            value={price}
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPrice(event.target.value)
                }}
            />
        </Modal>
    </div>
  )
}

export default UpdatePrice