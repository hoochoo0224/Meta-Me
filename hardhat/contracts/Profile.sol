// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Profile {
    struct ProfileData {
        string image;
        string name;
        string[] interests;
        string[] jobs;
    }

    ProfileData profile;

    constructor (string memory _image, string memory _name, string[] memory _interests, string[] memory _jobs) {
        setProfile(_image, _name, _interests, _jobs);
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
