-- CreateTable
CREATE TABLE "Komponentti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kategoria" TEXT NOT NULL,
    "merkki" TEXT NOT NULL,
    "malli" TEXT NOT NULL,
    "hinta" REAL NOT NULL,
    "maara" INTEGER NOT NULL,
    "paivitetty" TEXT NOT NULL
);
