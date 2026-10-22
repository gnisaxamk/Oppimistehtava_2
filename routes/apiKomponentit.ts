import express from 'express';
import { prisma } from '../lib/prisma';
import { Virhe } from '../errors/virhekasittelija';

const apiKomponentitRouter: express.Router = express.Router();
apiKomponentitRouter.use(express.json());

// Haetaan kaikki komponentit
apiKomponentitRouter.get("/", async (_req: express.Request, res: express.Response) => {
    const komponentit = await prisma.komponentti.findMany();
    res.json(komponentit);
});

export default apiKomponentitRouter;