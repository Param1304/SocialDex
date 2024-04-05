// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    mapping(address => string[]) public fileHashes; 

    event FileUploaded(address indexed uploader, string ipfsHash);

    function uploadFile(string memory ipfsHash) public {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        fileHashes[msg.sender].push(ipfsHash); 
        emit FileUploaded(msg.sender, ipfsHash);
    }

    function getFileHashes() public view returns (string[] memory) {
        return fileHashes[msg.sender];
    }
}
