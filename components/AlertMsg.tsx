import classNames from "classnames";
import React from "react";

export const AlertMsg = ({
  type,
  children,
}: {
  type: "success" | "error";
  children: React.ReactNode;
}) => {
  const classes = {
    "bg-green-50 text-green-500 border-green-500": type === "success",
    "bg-red-50 text-red-500 border-red-500": type === "error",
  };
  return (
    <div
      className={classNames(
        `max-w-xs  break-words text-sm border-2 rounded-md my-5 p-4`,
        classes
      )}
    >
      {children}
      {/* You have successfully approved transaction!
      <div>
        <a
          className=" underline"
          href={`https://testnet.bscscan.com/tx/${data?.hash}`}
          target="_blank"
          rel="noreferrer"
        >
          See transaction here (BscScan testnet)
        </a>
      </div> */}
    </div>
  );
};
