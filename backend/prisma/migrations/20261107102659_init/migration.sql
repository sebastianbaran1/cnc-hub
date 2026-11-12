-- CreateEnum
CREATE TYPE "MaterialCategory" AS ENUM ('METAL', 'WOOD', 'PLASTICS');

-- CreateEnum
CREATE TYPE "ProductionScale" AS ENUM ('PROTOTYPE', 'SMALL_BATCH', 'MASS_PRODUCTION', 'LONG_TERM');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('URGENT', 'UP_TO_1_WEEK', 'UP_TO_2_WEEKS', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('COMPANY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('SHIPPING', 'LOCAL', 'BOTH');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "materialCategory" "MaterialCategory" NOT NULL,
    "productionScale" "ProductionScale" NOT NULL,
    "urgency" "Urgency" NOT NULL,
    "clientType" "ClientType" NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "postalCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
