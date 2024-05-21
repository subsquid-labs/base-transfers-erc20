import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Contract, Transfer } from "./model";
import { processor } from "./processor";
import { isErc20 } from "./isErc20";
import * as erc20 from "./abi/erc20";

processor.run(new TypeormDatabase({ supportHotBlocks: false }), async (ctx) => {
  const knownContractsArray: Contract[] = await ctx.store.find(Contract, {
    where: { isErc20: true },
  });
  const knownContracts: Map<string, Contract> = new Map(
    knownContractsArray.map((c) => [c.address, c])
  );
  const newContracts: Map<string, Contract> = new Map();

  const transfers: Transfer[] = [];

  for (let block of ctx.blocks) {
    for (let trc of block.traces) {
      if (
        trc.type === "create" &&
        trc.result?.code &&
        isErc20(trc.result.code)
      ) {
        if (!trc.transaction) {
          ctx.log.info(`ERROR: trace came without a parent transaction`);
          console.log(trc);
          continue;
        }
        let address = trc.result.address;
        ctx.log.info(`Detected an ERC20 contract deployment at ${address}`);
        newContracts.set(
          address,
          new Contract({
            id: address,
            deploymentHeight: block.header.height,
            deploymentTxn: trc.transaction.hash,
            address,
            isErc20: true,
          })
        );
      }
    }
    for (let log of block.logs) {
      if (log.topics[0] === erc20.events.Transfer.topic) {
        let contract: Contract | undefined =
          knownContracts.get(log.address) ?? newContracts.get(log.address);
        if (contract) {
          let { from, to, value } = erc20.events.Transfer.decode(log);
          ctx.log.info(
            `Transfer ${value} from ${from} to ${to} in contract ${contract.address}`
          );
          transfers.push(
            new Transfer({
              id: log.id,
              contract,
              from,
              to,
              value,
            })
          );
        }
      }
    }
  }

  await ctx.store.upsert([...newContracts.values()]);
  await ctx.store.upsert(transfers);
});
