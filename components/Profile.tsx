import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { shortenAddress } from "../libs/funcs";
import { useEffect } from "react";

export default function Profile() {
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const {
    error: switchNetworkError,
    isLoading: isLoadingSwitchNetwork,
    switchNetwork,
  } = useSwitchNetwork({
    chainId: 97,
  });
  //   console.log(switchNetwork);
  //   console.log("chains", chains);

  useEffect(() => {
    if (switchNetwork && chain?.id !== 97) {
      switchNetwork(97);
    }
  }, [switchNetwork, chain?.id]);

  isLoading || (isLoadingSwitchNetwork && <p>LOADING...</p>);

  if (isConnected) {
    return (
      <>
        <div className=" flex justify-center items-center space-x-4 py-4 border-b-2">
          <div>
            <p>{chain?.name}</p>
            <p>Connected to {connector?.name}</p>
            <p>Address: {shortenAddress(`${address}`)}</p>
          </div>
          <button className="warning_btn" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
        <div>
          <p className=" text-red-500 text-sm">{error && error?.message}</p>
          <p className=" text-red-500 text-sm">
            {switchNetwork && switchNetworkError?.message}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-center border-b-2 p-4">
      <div>
        {connectors.map((connector) => (
          <button
            className="primary_btn"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => {
              connect({ connector });
            }}
          >
            {`Connect to ${connector.name}`}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}

        <div>
          <p className=" text-red-500 text-sm">{error && error?.message}</p>
          <p className=" text-red-500 text-sm">
            {switchNetwork && switchNetworkError?.message}
          </p>
        </div>
      </div>
    </div>
  );
}
