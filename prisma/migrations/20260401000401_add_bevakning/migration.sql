-- CreateTable
CREATE TABLE "Bevakning" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "stipendiumId" TEXT NOT NULL,
    "skickad" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bevakning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bevakning_skickad_stipendiumId_idx" ON "Bevakning"("skickad", "stipendiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Bevakning_email_stipendiumId_key" ON "Bevakning"("email", "stipendiumId");

-- AddForeignKey
ALTER TABLE "Bevakning" ADD CONSTRAINT "Bevakning_stipendiumId_fkey" FOREIGN KEY ("stipendiumId") REFERENCES "Stipendium"("id") ON DELETE CASCADE ON UPDATE CASCADE;
