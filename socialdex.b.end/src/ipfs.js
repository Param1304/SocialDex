import { useState } from 'react';
import axios from 'axios';
import FormData from 'form-data';
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmODc0YTBmZC00ZjEzLTQ1NWMtYmE0ZS1lOWEwNmFmNTI1YjgiLCJlbWFpbCI6ImR3aWpwcmFtb2RzYXdhbnRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjYyNTc3MDdhYzYzYzA4NmI5ZGMxIiwic2NvcGVkS2V5U2VjcmV0IjoiNDYxOTZlZmRkMjMyOTYyODljODQ2MmM4Y2ZhOGRmN2Y2N2YzYWQzZWIyMzg3Yjg0ZGE4ODE1OWIzMzBiYTNlNSIsImlhdCI6MTcxMDk1MDE4Mn0.MUdGRvNRT98eI99TktG0LX5A4gmy28rZYz3olcQuaBE';

const useFileUpload = (initialFile = null) => {
  const [file, setFile] = useState(initialFile);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return { file, handleFileChange };
};

const pinFileToIPFS = async (file) => {
  const formData = new FormData();
  const fileContent = new Blob([file]);
  formData.append('file',fileContent);
  const pinataMetadata = JSON.stringify({
    name: "file",
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${JWT}`,
      },
      
    });
    const { IpfsHash } = res.data
console.log("Your IPFS CID is:", IpfsHash);
   return  IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

export{useFileUpload,pinFileToIPFS};