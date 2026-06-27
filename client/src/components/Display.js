import { useState, useEffect } from "react";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [otherAddress, setOtherAddress] = useState("");

  const getdata = async (addressToFetch) => {
    let dataArray;
    try {
      if (addressToFetch) {
        dataArray = await contract.display(addressToFetch);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access or no files found");
      console.error(e);
      return;
    }

    if (dataArray && dataArray.length > 0) {
      const images = dataArray.map((url, index) => ({
        id: index,
        url: url,
        name: `File ${index + 1}`
      }));
      setData(images);
    } else {
      setData([]);
    }
  };

  // Automatically load files for the connected account when component mounts
  useEffect(() => {
    if (contract && account) {
      getdata(account);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  return (
    <>
      {/* Get Data Section */}
      <div className="section-card">
        <h3 className="section-title">View Shared Drive</h3>
        <div className="input-group">
          <input
            type="text"
            className="input-field"
            placeholder="Enter owner's address to view their files"
            value={otherAddress}
            onChange={(e) => setOtherAddress(e.target.value)}
          />
          <button className="btn-primary" onClick={() => getdata(otherAddress)}>
            View Files
          </button>
        </div>
      </div>

      {/* Files Display */}
      <h3 className="files-heading">Your Images</h3>
      {data.length === 0 ? (
        <div className="empty">No files uploaded yet</div>
      ) : (
        <div className="image-grid">
          {data.map((f) => (
            <div key={f.id} className="image-card">
              <a href={f.url} target="_blank" rel="noreferrer">
                <img src={f.url} alt={f.name} />
              </a>
              <div className="name">{f.name}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Display;
