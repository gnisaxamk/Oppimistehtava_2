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

// Lisätään uusi komponentti
apiKomponentitRouter.post("/", async (req: express.Request, res: express.Response) => {

    const body = req.body;

    const kelvollinen = onTeksti(body?.kategoria)
        && onTeksti(body?.merkki)
        && onTeksti(body?.malli)
        && onHinta(body?.hinta)
        && onMaara(body?.maara);

    if (!kelvollinen) {
        throw new Virhe(400, "Virheellinen pyyntö");
    }

    const uusiKomponentti = await prisma.komponentti.create({
        data: {
            kategoria: body.kategoria,
            merkki: body.merkki,
            malli: body.malli,
            hinta: body.hinta,
            maara: body.maara,
            paivitetty: tanaan(),
        },
    });

    res.status(201).json(uusiKomponentti);

    // Muokataan komponentin määrää
apiKomponentitRouter.put("/:id", async (req: express.Request, res: express.Response) => {

    const id = Number(req.params.id);

    const loytyi = Number.isInteger(id)
        && (await prisma.komponentti.count({ where: { id } })) === 1;

    if (!loytyi) {
        throw new Virhe(404, "Komponenttia ei löytynyt annetulla id:llä");
    }

    if (!onMaara(req.body?.maara)) {
        throw new Virhe(400, "Virheellinen pyynnön body");
    }

    const muokattuKomponentti = await prisma.komponentti.update({
        where: { id },
        data: {
            maara: req.body.maara,
            paivitetty: tanaan(),
        },
    });

    res.json(muokattuKomponentti);
});

// Poistetaan komponentti ja palautetaan jäljellä olevat
apiKomponentitRouter.delete("/:id", async (req: express.Request, res: express.Response) => {

    const id = Number(req.params.id);

    const loytyi = Number.isInteger(id)
        && (await prisma.komponentti.count({ where: { id } })) === 1;

    if (!loytyi) {
        throw new Virhe(404, "Komponenttia ei löytynyt annetulla id:llä");
    }

    await prisma.komponentti.delete({ where: { id } });

    const jaljella = await prisma.komponentti.findMany();

    res.json(jaljella);
});

});

});

export default apiKomponentitRouter;