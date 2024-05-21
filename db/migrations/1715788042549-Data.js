module.exports = class Data1715788042549 {
    name = 'Data1715788042549'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, "contract_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8b5f51515a63064d5d10f9f0f3" ON "transfer" ("contract_id") `)
        await db.query(`CREATE INDEX "IDX_be54ea276e0f665ffc38630fc0" ON "transfer" ("from") `)
        await db.query(`CREATE INDEX "IDX_4cbc37e8c3b47ded161f44c24f" ON "transfer" ("to") `)
        await db.query(`CREATE INDEX "IDX_029e97d36121eb6a47dc853cf6" ON "transfer" ("value") `)
        await db.query(`CREATE TABLE "contract" ("id" character varying NOT NULL, "deployment_height" integer NOT NULL, "deployment_txn" text NOT NULL, "address" text NOT NULL, "is_erc20" boolean NOT NULL, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a7b1ff78eca9d3133d56e23cb6" ON "contract" ("deployment_height") `)
        await db.query(`CREATE INDEX "IDX_0c27ff4379e363a83d1f601ea8" ON "contract" ("deployment_txn") `)
        await db.query(`CREATE INDEX "IDX_4bbe5fb40812718baf74cc9a79" ON "contract" ("address") `)
        await db.query(`CREATE INDEX "IDX_ff7132ccb47790df228a5168f8" ON "contract" ("is_erc20") `)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_8b5f51515a63064d5d10f9f0f30" FOREIGN KEY ("contract_id") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_8b5f51515a63064d5d10f9f0f3"`)
        await db.query(`DROP INDEX "public"."IDX_be54ea276e0f665ffc38630fc0"`)
        await db.query(`DROP INDEX "public"."IDX_4cbc37e8c3b47ded161f44c24f"`)
        await db.query(`DROP INDEX "public"."IDX_029e97d36121eb6a47dc853cf6"`)
        await db.query(`DROP TABLE "contract"`)
        await db.query(`DROP INDEX "public"."IDX_a7b1ff78eca9d3133d56e23cb6"`)
        await db.query(`DROP INDEX "public"."IDX_0c27ff4379e363a83d1f601ea8"`)
        await db.query(`DROP INDEX "public"."IDX_4bbe5fb40812718baf74cc9a79"`)
        await db.query(`DROP INDEX "public"."IDX_ff7132ccb47790df228a5168f8"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_8b5f51515a63064d5d10f9f0f30"`)
    }
}
