// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract erc is ERC1155{
   address Owner;
string public  baseTokenURIforCoCompletion;
constructor(string memory _uriforcompletion) ERC1155("post") {


baseTokenURIforCoCompletion = _uriforcompletion;
Owner = msg.sender;
}

struct Post{
    string title;
    string ipfsHash;
   }
   mapping(uint =>Post) public Noofpost;
   uint public Nthpost;
   function mint (string memory _title,string memory _ipfsHash) public {
     Post storage newpost=Noofpost[Nthpost];

     newpost.title=_title ;
     newpost.ipfsHash=_ipfsHash;
     bytes memory data = abi.encode(newpost);
     _mint(Owner,Nthpost,0,data);
     Nthpost++;
   }
function Fetchpost() public view virtual  returns (string memory){

return baseTokenURIforCoCompletion;

}
 function fetchAllPosts() public view returns (string[] memory titles, string[] memory ipfsHashes) {
        titles = new string[](Nthpost);
        ipfsHashes = new string[](Nthpost);
        
        for (uint i = 0; i < Nthpost; i++) {
            titles[i] = Noofpost[i].title;
            ipfsHashes[i] = Noofpost[i].ipfsHash;
        }
        
        return (titles, ipfsHashes);
    }
}