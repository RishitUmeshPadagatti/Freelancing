-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CLIENT', 'FREELANCER');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "Freelancer" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'FREELANCER';
