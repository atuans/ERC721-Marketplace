in ERC721 standard

getApproval() function will help us create the link between user and our marketplace

=> the user will let our market get the approval to sell the NFTs for them

    function getApproved(uint256 _tokenId) external view returns (address);

# Mapping

mapping(\_KeyType => \_ValueType)
These are used to store the data in the form of key-value pairs,

https://fravoll.github.io/solidity-patterns/pull_over_push.html

In this case we have 3 eventss ( ItemListed, ItemBought and ItemCanceled)

By using Moralis sync smart contract event, we can whenever hear an item canceled events

=> We can stick it to our Moralis database
