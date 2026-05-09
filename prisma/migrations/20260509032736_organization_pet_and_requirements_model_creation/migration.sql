-- CreateEnum
CREATE TYPE "DogSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "DogEnergyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DogDependenceLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DogEnviromentRequirements" AS ENUM ('APARTMENT', 'HOUSE_WITH_YARD', 'DOG_PARK');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "owner_cep" TEXT NOT NULL,
    "owner_latitude" TEXT NOT NULL,
    "owner_longitude" TEXT NOT NULL,
    "whatsapp_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "size" "DogSize" NOT NULL,
    "energy_level" "DogEnergyLevel" NOT NULL,
    "dependency_level" "DogDependenceLevel" NOT NULL,
    "enviroment" "DogEnviromentRequirements" NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirements" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "petId" TEXT NOT NULL,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_owner_email_key" ON "Organization"("owner_email");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
