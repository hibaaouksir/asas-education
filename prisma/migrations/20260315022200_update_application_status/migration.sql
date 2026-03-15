-- AlterTable
ALTER TABLE "student_applications" ADD COLUMN     "finalAdmission" TEXT,
ADD COLUMN     "offerLetter" TEXT,
ALTER COLUMN "status" SET DEFAULT 'APPLIED';
