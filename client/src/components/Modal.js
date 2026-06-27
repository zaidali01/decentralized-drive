import { useState } from "react";

const Modal = ({ contract, toast }) => {
  const [shareAddress, setShareAddress] = useState("");

  const sharing = async () => {
    if (!shareAddress.trim() || !contract) return;
    try {
      const tx = await contract.allow(shareAddress);
      await tx.wait();
      toast.success("Access granted to " + shareAddress.slice(0, 6) + "...");
      setShareAddress("");
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share access");
    }
  };

  return (
    <div className="section-card">
      <h3 className="section-title">Share Access</h3>
      <div className="input-group">
        <input
          type="text"
          className="input-field"
          placeholder="Enter Ethereum address to grant access"
          value={shareAddress}
          onChange={(e) => setShareAddress(e.target.value)}
        />
        <button className="btn-primary" onClick={sharing}>
          Share
        </button>
      </div>
    </div>
  );
};

export default Modal;
