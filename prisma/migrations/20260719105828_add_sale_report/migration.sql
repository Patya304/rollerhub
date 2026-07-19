-- CreateTable
CREATE TABLE "SaleReport" (
    "id" TEXT NOT NULL,
    "scooterId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "publicToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "SaleReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleReport_scooterId_key" ON "SaleReport"("scooterId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleReport_publicToken_key" ON "SaleReport"("publicToken");

-- CreateIndex
CREATE INDEX "SaleReport_ownerId_idx" ON "SaleReport"("ownerId");

-- AddForeignKey
ALTER TABLE "SaleReport" ADD CONSTRAINT "SaleReport_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleReport" ADD CONSTRAINT "SaleReport_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
