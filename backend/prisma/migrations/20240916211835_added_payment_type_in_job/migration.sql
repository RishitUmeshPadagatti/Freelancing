/*
  Warnings:

  - Added the required column `paymentType` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('FULL', 'HOURLY');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "paymentType" "PaymentType" NOT NULL;
