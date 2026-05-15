/*
  Warnings:

  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_petId_fkey";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "Pet";

-- DropTable
DROP TABLE "Requirement";

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "formated_address" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "size" "DogSize" NOT NULL,
    "energy_level" "DogEnergyLevel" NOT NULL,
    "dependency_level" "DogDependenceLevel" NOT NULL,
    "environment" "DogEnvironmentRequirements" NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_owner_email_key" ON "organizations"("owner_email");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirements" ADD CONSTRAINT "requirements_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
