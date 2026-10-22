import express from 'express';
import { prisma } from '../lib/prisma';
import { Virhe } from '../errors/virhekasittelija';

const apiKomponentitRouter: express.Router = express.Router();
apiKomponentitRouter.use(express.json());

//Tarkistusfunktiot: antaa true jos arvo kelpaa
const onTeksti = (arvo: unknown): boolean => typeof arvo === "string" && arvo.trim().length > 0;
const onHinta = (arvo: unknown): boolean => typeof arvo === "number" && Number.isFinite(arvo) && arvo >= 0;
const onMaara = (arvo: unknown): boolean => typeof arvo === "number" && Number.isInteger(arvo) && arvo >= 0;

// Tämän päivän päivämäärä muodossa pp.kk.vvvv
const tanaan = (): string => new Date().toLocaleDateString("fi-FI", { day: "2-digit", month: "2-digit", year: "numeric" });

// Haetaan kaikki komponentit
apiKomponentitRouter.get("/", async (_req: express.Request, res: express.Response) => {
    const komponentit = await prisma.komponentti.findMany();
    res.json(komponentit);
});

export default apiKomponentitRouter;