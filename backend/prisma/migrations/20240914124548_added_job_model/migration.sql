-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ConnectsFibonacci" AS ENUM ('ONE', 'TWO', 'THREE', 'FIVE', 'EIGHT');

-- CreateEnum
CREATE TYPE "SupportedCurrency" AS ENUM ('INR', 'USD', 'EUR');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "status" "JobStatus" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "connectsRequired" "ConnectsFibonacci" NOT NULL,
    "currency" "SupportedCurrency" NOT NULL,
    "approxAmount" DOUBLE PRECISION NOT NULL,
    "maxAmount" DOUBLE PRECISION,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelancerJobQuestions" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "freelancerId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "reply" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FreelancerJobQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelancersOnApplications" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "freelancerId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FreelancersOnApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreelancersOnJob" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "freelancerId" INTEGER NOT NULL,
    "agreedAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FreelancersOnJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRequiredSkills" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "JobRequiredSkills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancerJobQuestions" ADD CONSTRAINT "FreelancerJobQuestions_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancerJobQuestions" ADD CONSTRAINT "FreelancerJobQuestions_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancersOnApplications" ADD CONSTRAINT "FreelancersOnApplications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancersOnApplications" ADD CONSTRAINT "FreelancersOnApplications_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancersOnJob" ADD CONSTRAINT "FreelancersOnJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreelancersOnJob" ADD CONSTRAINT "FreelancersOnJob_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequiredSkills" ADD CONSTRAINT "JobRequiredSkills_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequiredSkills" ADD CONSTRAINT "JobRequiredSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
