-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'MOTORCYCLE', 'TRUCK', 'VAN', 'SUV');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UNSPECIFIED', 'CASH', 'CARD', 'BANK_TRANSFER', 'PIX');

-- AlterTable
ALTER TABLE "quote_items" DROP COLUMN "type",
ADD COLUMN     "type" "QuoteItemType" NOT NULL;

-- AlterTable
ALTER TABLE "quotes" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "type",
ADD COLUMN     "type" "VehicleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_licensePlate_key" ON "vehicles"("licensePlate");
