-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertSettings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "materialCategories" "MaterialCategory"[],
    "productionScales" "ProductionScale"[],
    "urgencies" "Urgency"[],
    "clientTypes" "ClientType"[],
    "deliveryMethods" "DeliveryMethod"[],

    CONSTRAINT "AlertSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlertSettings_companyId_key" ON "AlertSettings"("companyId");

-- AddForeignKey
ALTER TABLE "AlertSettings" ADD CONSTRAINT "AlertSettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
