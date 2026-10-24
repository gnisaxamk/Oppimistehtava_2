import express from 'express';
import virhekasittelija from './errors/virhekasittelija';
import apiKomponentitRouter from './routes/apiKomponentit';

const app: express.Application = express();

const portti: number = Number(process.env.PORT) || 3102;

app.use("/api/komponentit", apiKomponentitRouter);

app.use(virhekasittelija);

app.listen(portti, (): void => {
    console.log(`Palvelin käynnistettiin osoitteeseen http://localhost:${portti}`);
});