import * as erc20 from "./abi/erc20";

export function isErc20(bytecode: string): boolean {
  for (let fname in erc20.functions) {
    let fsighash = erc20.functions[
      fname as keyof typeof erc20.functions
    ].selector.slice(2, 10);
    if (!bytecode.includes("63" + fsighash)) {
      return false;
    }
  }
  return true;
}
