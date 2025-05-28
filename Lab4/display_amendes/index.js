const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const getResponseLag = () => Math.random() * (10_000 - 200) + 200;
const getWebhookLag = () => Math.random() * (30_000 - 10_000) + 10_000;
const getTimeoutLag = () => Math.random() * (120_000 - 30_000) + 30_000;

const getRandomAmendesInCFA = function (max) {

    const montantAmendesRandom = Math.floor(Math.random() * max);
    const quotientBy500 = Math.floor(montantAmendesRandom / 500)
    return (quotientBy500 + 1) * 500
}

const simulateLatency = (latency) => {
    return new Promise((resolve) => setTimeout(resolve, latency));
};


app.get("/amendes", (req, res) => {
    console.log("Received request immat", req.query.immatriculation);
    const status = Math.random() > 1 / 3 ? "completed" : "declined";
    const immatriculation = req.params.immatriculation;

    // 10% of the time, will timeout. Half of the time, the transaction is actually processed.
    const shouldTimeout = Math.random() < 1 / 10;
    if (shouldTimeout) {
        const timeOutLag = getTimeoutLag();
        console.log("Will timeout");
        return simulateLatency(timeOutLag).then(() => res.status(504).send("Timeout"));
    } else {
        const amendes_responses = {immatriculation: immatriculation, montant: getRandomAmendesInCFA(100000)}
        const responseLag = getResponseLag();
        return simulateLatency(responseLag).then(() => {
                console.log(amendes_responses)
                res.status(200).send(amendes_responses);
            }
        )
    }

});


app.listen(port, () => {
    console.log(`Third party mock is listening on port ${port}`);
});
