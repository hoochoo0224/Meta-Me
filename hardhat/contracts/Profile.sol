// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";


contract Profile is Initializable {
    struct ProfileData {
        string image;
        string name;
        string[] interests;
        string[] jobs;
    }

    ProfileData profile;

    function createProfile(string memory _image, string memory _name, string[] memory _interests, string[] memory _jobs) public initializer {
        profile = ProfileData(_image, _name, _interests, _jobs);
    }
    
    function setProfile(string memory _image, string memory _name, string[] memory _interests, string[] memory _jobs) public {
        profile.image = _image;
        profile.name = _name;
        profile.interests = _interests;
        profile.jobs = _jobs;
    }

    function getProfile() public view returns (ProfileData memory) {
        return profile;
    }
}
