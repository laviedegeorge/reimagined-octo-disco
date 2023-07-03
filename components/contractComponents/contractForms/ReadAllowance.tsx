import React, { EventHandler, useCallback, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { contractAddress, erc20ABI } from "../../../libs/contractABIs/erc20ABI";

const Allowance = ({ args }: { args: string[] }) => {
  const [errMsg, setErrMsg] = useState<null | string>(null);
  const [allowance, setAllowance] = useState<null | unknown>();

  const { data, isLoading, error } = useContractRead({
    address: contractAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args,
  });

  useEffect(() => {
    setAllowance(`${data}`);
  }, [data]);

  useEffect(() => {
    if (error) setErrMsg(`${error.message}`);
  }, [error]);

  return (
    <div className="my-2">
      {allowance && <p>The allowance is: {allowance}</p>}
      {!allowance && errMsg && <p className="text-sm text-red-500">{errMsg}</p>}
    </div>
  );
};

export default function ReadAllowance() {
  const [args, setArgs] = useState<undefined | string[]>(undefined);
  const [formValues, setFormValues] = useState({
    owner: "",
    spender: "",
  });

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, name: "owner" | "spender") => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return (
    <form className="space-y-3">
      <label>
        Owner address <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.owner}
          onChange={(e) => onChange(e, "owner")}
          placeholder="0xE58...4B29"
        />
      </label>
      <label>
        spender address <br />
        <input
          type="text"
          className="block border px-4 py-2 w-full mt-1"
          value={formValues.spender}
          onChange={(e) => onChange(e, "spender")}
          placeholder="0xE58...4B29"
        />
      </label>
      <div>
        {args && <Allowance args={args} />}
        <button
          onClick={() => {
            if (formValues.owner === "" || formValues.spender === "") return;
            setArgs([formValues.owner, formValues.spender]);
          }}
          type="button"
          className="primary_btn"
        >
          {/* {isLoading ? "Loading..." : "Check allowance"} */}
          Check allowance
        </button>
      </div>
    </form>
  );
}
