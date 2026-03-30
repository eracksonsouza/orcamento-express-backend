-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "paymentDiscount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'UNSPECIFIED',
ADD COLUMN     "vehicleId" TEXT;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
