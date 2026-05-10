/*
  Warnings:

  - You are about to drop the column `enviroment` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `environment` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DogEnvironmentRequirements" AS ENUM ('APARTMENT', 'HOUSE_WITH_YARD', 'DOG_PARK');

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "enviroment",
ADD COLUMN     "environment" "DogEnvironmentRequirements" NOT NULL;

-- DropEnum
DROP TYPE "DogEnviromentRequirements";
