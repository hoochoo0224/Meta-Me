// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MakeNFT is ERC721URIStorage, Ownable {
    uint256 private tokenId = 0;
    mapping(address => uint256) private userTokenIds;

    constructor() ERC721("Profile", "PRFL") Ownable(msg.sender) {}

    function mint(string memory uri) public {
        require(balanceOf(msg.sender) == 0, "User already has a Profile NFT");

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        userTokenIds[msg.sender] = tokenId;
        tokenId++;
    }

    function setNFT(string memory uri) public {
        require(balanceOf(msg.sender) > 0, "User doesn't have a Profile NFT");
        _setTokenURI(userTokenIds[msg.sender], uri);
    }
    
    function deleteNFT() public {
        require(balanceOf(msg.sender) > 0, "User doesn't have a Profile NFT");
        uint256 userTokenId = userTokenIds[msg.sender];
        delete userTokenIds[msg.sender];
        _burn(userTokenId);
    }

    function isMinted() public view returns (bool) {
        return (balanceOf(msg.sender) > 0);
    }

    function getTokenId() public view returns (uint256) {
        require(balanceOf(msg.sender) > 0, "User doesn't have a Profile NFT");
        uint256 userTokenId = userTokenIds[msg.sender];
        require(userTokenId < tokenId, "Invalid token ID");
        return userTokenId;
    }

    function tokenExists(uint256 _tokenId) public view returns (bool) {
        return _ownerOf(_tokenId) != address(0);
    }
}