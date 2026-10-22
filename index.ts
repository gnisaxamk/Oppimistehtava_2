import express from 'express';

const app: express.Application = express();

const portti: number = Number(process.env.PORT) || 3102;

app.listen(portti, (): void => {
    console.log(`Palvelin käynnistettiin osoitteeseen http://localhost:${portti}`);
});