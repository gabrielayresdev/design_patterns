/*
  Warnings:

  - You are about to drop the `Requirements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Requirements" DROP CONSTRAINT "Requirements_petId_fkey";

-- DropTable
DROP TABLE "Requirements";

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "petId" TEXT NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
