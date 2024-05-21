import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as erc20 from "./abi/erc20";
export const processor = new EvmBatchProcessor()
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/evm-indexing/supported-networks/
  .setGateway("https://v2.archive.subsquid.io/network/base-mainnet")
  // Chain RPC endpoint is required for
  //  - indexing unfinalized blocks https://docs.subsquid.io/basics/unfinalized-blocks/
  //  - querying the contract state https://docs.subsquid.io/evm-indexing/query-state/
  .setRpcEndpoint({
    // Set the URL via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    url: assertNotNull(process.env.RPC_ENDPOINT),
    // More RPC connection options at https://docs.subsquid.io/evm-indexing/configuration/initialization/#set-data-source
    rateLimit: 10,
  })
  .setFinalityConfirmation(75)
  .setFields({
    transaction: {
      from: true,
      value: true,
      hash: true,
    },
    trace: {
      createResultCode: true, // for checking ERC721 compliance
      createResultAddress: true,
    },
  })
  .setBlockRange({
    from: 0,
  })
  .addTrace({
    type: ["create"],
    transaction: true,
  })
  .addLog({
    topic0: [erc20.events.Transfer.topic],
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
