-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "scooterId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "odometerKm" INTEGER,
    "cost" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_scooterId_idx" ON "Service"("scooterId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
