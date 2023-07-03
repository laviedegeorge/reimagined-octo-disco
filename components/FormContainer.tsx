import { DownOutlined } from "@ant-design/icons";
import classNames from "classnames";
import React from "react";

export default function FormContainer({
  isOpen,
  setIsOpen,
  header,
  children,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  header: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded">
      <div
        className={classNames(`flex justify-between items-center p-4`, {
          "border-b": isOpen,
        })}
      >
        <h3 className=" font-medium">{header}</h3>
        <button
          className={classNames(
            "flex justify-center items-center transition duration-300",
            {
              "rotate-180": isOpen,
              "": !isOpen,
            }
          )}
          onClick={() => setIsOpen()}
        >
          <DownOutlined />
        </button>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}
