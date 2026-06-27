import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x337cD016b9f606e43E6bfFD537cFE28720d06219";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Not connected
  if (!account) {
    return (
      <div className="connect-page">
        <h1>Decentralized Drive</h1>
        <p>Upload and share files securely on the blockchain</p>
        <button className="connect-btn-large" onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    );
  }

  // Connected
  return (
    <div className="App">
      <nav className="navbar">
        <h2>D-Drive</h2>
        <div className="account">
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
        </div>
      </nav>

      <div className="container">
        
        {/* Upload and Share in same row */}
        <div className="row">
          <FileUpload 
            account={account} 
            provider={provider}
            contract={contract}
          />

          <Modal 
            contract={contract} 
          />
        </div>

        {/* Display Section rendered via Display component */}
        <Display 
          contract={contract} 
          account={account} 
        />

      </div>
    </div>
  );
}

export default App;
