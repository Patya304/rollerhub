-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "scooterId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "distanceKm" DOUBLE PRECISION,
    "avgSpeed" DOUBLE PRECISION,
    "maxSpeed" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ride_scooterId_idx" ON "Ride"("scooterId");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
