/*
  Warnings:

  - You are about to drop the column `owner_cep` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `owner_latitude` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `owner_longitude` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `cep` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formated_address` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "owner_cep",
DROP COLUMN "owner_latitude",
DROP COLUMN "owner_longitude",
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "formated_address" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;
