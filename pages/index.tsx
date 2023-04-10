import { useNetwork, useAccount, useConnect, useDisconnect } from "wagmi";
import { utils } from "ethers";
import { useState, useEffect } from "react";

export default function Home() {
  const NETWORK_DATA = [
    {
      id: 1,
      image: "assets/icons/eth.png",
      name: "Ethereum",
      isActive: true,
      chainId: utils.hexValue(1),
      chainNoHex: 1,
      chainName: "Ethereum Mainnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: [
        "https://mainnet.infura.io/v3/ca11249dabe247c1a6e0877c24376dda",
      ],
      blockExplorerUrls: ["https://etherscan.io"],
    },
    {
      id: 2,
      image: "assets/icons/bnb.png",
      name: "BSC",
      isActive: false,
      chainId: utils.hexValue(56),
      chainNoHex: 56,
      chainName: "BSC Mainnet",
      nativeCurrency: { name: "BSC", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed1.binance.org/"],
      blockExplorerUrls: ["https://bscscan.com/"],
    },
  ];

  const [currentNetwork, setCurrentNetwork] = useState(NETWORK_DATA[0]);

  const { chain } = useNetwork();
  const { isConnected: isUserConnected, address } = useAccount();
  const [isOpen, setIsOpen] = useState(false); //modal
  const [walletDetails, setWalletDetails] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // CheckNetwork();
  }, [isUserConnected, currentNetwork]);

  const CheckNetwork = () => {
    if (isUserConnected && chain?.id !== currentNetwork.chainNoHex) {
      console.log(
        "",
        chain?.id,
        currentNetwork.chainId
      );
      setSwitchOpen(true);
    }
  };

  const { connectors, connect } = useConnect({
    onSuccess() {
      console.log("success");
    },
  });

  const handleSwitchNetwork = async () => {
    const { chainId, chainName, rpcUrls } = currentNetwork;
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (err: any) {
      console.log(err);
      if (err.code === 4902) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName,
                rpcUrls,
              },
            ],
          });
        } catch (addError) {
          return null;
        }
      }
    }
    return null;
  };

  const logout = () => {
    disconnect();
  };
  useEffect(() => {
    if (count === 0) {
      setCurrentNetwork(NETWORK_DATA[0]);
    } else {
      setCurrentNetwork(NETWORK_DATA[1]);
    }
  }, [count]);

  useEffect(() => {
    handleSwitchNetwork();
  }, [currentNetwork]);

  return (
    <div className="flex flex-col px-12 py-24">
      {connectors.map((connector, index) => (
        <div
          key={index}
          onClick={() => connect({ connector })}
          className="border-2 rounded-lg my-3 cursor-pointer border-gray-300 w-full text-black px-2 py-3 hover:bg-gray-200 hover:text-green-800"
        >
          {connector.name}
        </div>
      ))}
      <select
        className="py-2 my-4 outline-none bg-blue-200 rounded-md px-4"
        onChange={async (e: any) => {
          setCount(e.target.value === "ETH" ? 0 : 1);
        }}
      >
        <option value="ETH" className="">
          ETH
        </option>

        <option value="BNB" className="">
          BNB
        </option>
      </select>
      <button
        className="bg-red-400 px-6 py-2 rounded-md active:bg-red-200"
        onClick={logout}
      >
        Disconnect
      </button>
    </div>
  );
}
