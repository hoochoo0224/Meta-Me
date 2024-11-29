// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MakeNFT2 is ERC721URIStorage, Ownable {
    uint256 private tokenId = 0;
    mapping(address => uint256) private userTokenIds;

    constructor() ERC721("Profile", "PRFL") Ownable(msg.sender) {}

    function mint(address addr, string memory uri) public onlyOwner {
        require(balanceOf(addr) == 0, "User already has a Profile NFT");

        _mint(addr, tokenId);
        _setTokenURI(tokenId, uri);
        userTokenIds[addr] = tokenId;
        tokenId++;
    }

    function setNFT(address addr, string memory uri) public onlyOwner {
        require(balanceOf(addr) > 0, "User doesn't have a Profile NFT");

        _setTokenURI(userTokenIds[addr], uri);
    }
    
    function deleteNFT(address addr) public onlyOwner {
        require(balanceOf(addr) > 0, "User doesn't have a Profile NFT");

        uint256 userTokenId = userTokenIds[addr];
        delete userTokenIds[addr];
        _burn(userTokenId);
    }

    function isMinted(address addr) public view onlyOwner returns (bool) {
        return (balanceOf(addr) > 0);
    }

    function getTokenId(address addr) public view onlyOwner returns (uint256) {
        require(balanceOf(addr) > 0, "User doesn't have a Profile NFT");
        uint256 userTokenId = userTokenIds[addr];
        require(userTokenId < tokenId, "Invalid token ID");
        return userTokenId;
    }

    function tokenExists(uint256 _tokenId) public view onlyOwner returns (bool) {
        return _ownerOf(_tokenId) != address(0);
    }
}