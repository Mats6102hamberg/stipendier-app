-- CreateTable
CREATE TABLE "Stipendium" (
    "id" TEXT NOT NULL,
    "namn" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "beskrivning" TEXT NOT NULL,
    "belopp" INTEGER,
    "beloppMax" INTEGER,
    "deadline" TIMESTAMP(3),
    "kategorier" TEXT[],
    "url" TEXT,
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stipendium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stipendium_deadline_idx" ON "Stipendium"("deadline");
