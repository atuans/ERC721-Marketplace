// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MarketplaceV4 {
  struct AuctionItem {
    uint256 id;
    uint256 tokenId;
    address nftAddress;
    address payable seller;
    uint256 price;
    bool isSold;
  }

  AuctionItem[] public itemsForSale;

  mapping(address => mapping(uint256 => bool)) activeItem; // when we dont wanna loop through the array to see if a specific item is active

  event ItemAdded(
    uint256 id,
    uint256 tokenId,
    address nftAddress,
    uint256 price
  );
  event ItemSold(uint256 id, address buyer, uint256 price);

  modifier OnlyItemOwner(address nftAddress, uint256 tokenId) {
    IERC721 tokenContract = IERC721(nftAddress);
    require(tokenContract.ownerOf(tokenId) == msg.sender);
    _;
  }

  modifier HasTransferApproval(address nftAddress, uint256 tokenId) {
    IERC721 tokenContract = IERC721(nftAddress);
    require(tokenContract.getApproved(tokenId) == address(this));
    //    function getApproved(uint256 _tokenId) external view returns (address);
    // 0xcklsdfgjdfngkldf. getApproved(tokenId) True if `_operator` is an approved operator for `_owner`, false otherwise equal to logged in address
    _;
  }

  modifier ItemExists(uint256 id) {
    require(
      id < itemsForSale.length && itemsForSale[id].id == id,
      "Could not find Item"
    );
    _;
  }

  modifier IsForSale(uint256 id) {
    require(itemsForSale[id].isSold == false, "Item already sold");
    _;
  }

  function addItemToMarket(
    uint256 tokenId,
    address nftAddress,
    uint256 price
  )
    external
    OnlyItemOwner(nftAddress, tokenId)
    HasTransferApproval(nftAddress, tokenId)
    returns (uint256)
  {
    require(
      activeItem[nftAddress][tokenId] == false,
      "Item already up for sale"
    );
    uint256 newItemId = itemsForSale.length;
    itemsForSale.push(
      AuctionItem(
        newItemId,
        tokenId,
        nftAddress,
        payable(msg.sender),
        price,
        false
      )
    );
    activeItem[nftAddress][tokenId] = true;

    assert(itemsForSale[newItemId].id == newItemId);
    emit ItemAdded(newItemId, tokenId, nftAddress, price);
    return newItemId;
  }

  function BuyMarketItem(uint256 id)
    external
    payable
    ItemExists(id)
    IsForSale(id)
    HasTransferApproval(itemsForSale[id].nftAddress, itemsForSale[id].tokenId)
  {
    require(msg.value >= itemsForSale[id].price, "Not Enough Fund");
    require(msg.sender != itemsForSale[id].seller);
    itemsForSale[id].isSold = true;

    activeItem[itemsForSale[id].nftAddress][itemsForSale[id].tokenId] = false;
    IERC721(itemsForSale[id].nftAddress).safeTransferFrom(
      itemsForSale[id].seller,
      msg.sender,
      itemsForSale[id].tokenId
    );
    itemsForSale[id].seller.transfer(msg.value);
    emit ItemSold(id, msg.sender, itemsForSale[id].price);
  }
}
