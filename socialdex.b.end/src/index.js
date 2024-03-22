import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {ethers} from 'ethers';
import axios from 'axios';
import { useFileUpload, pinFileToIPFS } from './ipfs.js';
//install ethers.js pre version 5.7 cuz issue with the provider..too much change sed...npm i ethers@5.7
const provider = new ethers.providers.Web3Provider(window.ethereum, "sepolia"); //new ethers.BrowserProvider(window.ethereum)
const contractAddress = "0xf74521381cf4f0fe83b3216ccc0f77d41890429b"; // Contract address
const abi =[
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "uploader",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "FileUploaded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "fileHashes",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFileHashes",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "uploadFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]; // ABI of your contract

const UserProfile = () => {
  const [Username, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [contract, setContract] = useState(null);
  const [FullName, setFullname,setProfilePicture] = useState('');
//   const { file: profilePicture, handleFileChange: handleProfilePictureChange, } = useFileUpload(); //forpfp(working on it)
  const handleProfileUpload = async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner(accounts[0]);

      // Prepare profile data
      const profileData = {
        Username,
        age,
        FullName
      };

      // Convert profile data to JSON and pin it to IPFS
      const ipfsHash = await pinFileToIPFS(JSON.stringify(profileData));

      // Set contract
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Upload IPFS hash to the blockchain
      await contract.uploadFile(ipfsHash);

      console.log("IPFS Hash:", ipfsHash);
    } catch (error) {
      console.error("Error during profile upload:", error);
    }
  };

  const fetchProfileInformation = async () => {
    if (contract) {
        try {
            // Fetch IPFS hash from the blockchain
            const ipfsHashes = await contract.getFileHashes();

            // Fetch profile data from IPFS for the latest hash
            const latestHash = ipfsHashes[ipfsHashes.length - 1]; // Get the latest hash and not overlaps
            const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${latestHash}`);
            const { Username, age, FullName } = response.data;

            // Update profile state with fetched data
            setUserName(Username);
            setAge(age);
            setFullname(FullName);
        } catch (error) {
            console.error("Error fetching profile information:", error);
        }
    }
};


useEffect(() => {
    async function setupContract() {
        try {
            await provider.send("eth_requestAccounts", []);
            const accounts = await provider.listAccounts();
            const signer = provider.getSigner(accounts[0]);
            const contract = new ethers.Contract(contractAddress, abi, signer);
            setContract(contract);
        } catch (error) {
            console.error("Error setting up contract:", error);
        }
    }
    
    setupContract();

}, []);


  return (
    <div>
      <h2>User Profile</h2>
      <form>
        <label>UserName:</label>
        <input type="text" value={Username} onChange={(e) => setUserName(e.target.value)} />

        <label>Age:</label>
        <input type="text" value={age} onChange={(e) => setAge(e.target.value)}/>

        <label>FullName:</label>
        <input type="text" value={FullName} onChange={(e) => setFullname(e.target.value)} />

        <button type="button" onClick={handleProfileUpload}>Upload Profile</button>
		<button type='button' onClick={fetchProfileInformation}>fetch</button>
      </form>
    </div>
  );
};

function Site() {
  return (
    <div>
      <UserProfile />
    </div>
  );
}

ReactDOM.render(<Site />, document.getElementById('root'));
