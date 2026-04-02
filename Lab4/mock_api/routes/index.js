var express = require('express');
var router = express.Router();


const listeLiquidation = {}
const listeMontantLiquidation = {}
const listeStatusPayments = {}
const listeStatusAmendes = {}
const getResponseLag = () => Math.random() * (5_000 - 200) + 200;
const getWebhookLag = () => Math.random() * (30_000 - 10_000) + 10_000;
const getTimeoutLag = () => Math.random() * 10_000;
const getRandomLiq = () => "LIQ-" + Math.floor(Math.random() * 10000);

const errorResponse = {errorCode: "403", errorMessage: "Requete invalide"}

const getRandomAmendesInCFA = function (max) {

    const montantAmendesRandom = Math.floor(Math.random() * max);
    const quotientBy500 = Math.floor(montantAmendesRandom / 500)
    return (quotientBy500 + 1) * 500
}
//------------------------------------------------
const getLiquidationByImmat = function (immat) {
    let response = getRandomLiq();
    if (immat in listeLiquidation) {
        response = listeLiquidation[immat]
    } else {
        listeLiquidation[immat] = response;
    }

    return response;
}
//-------------------------------------------
const simulateLatency = (latency) => {
    return new Promise((resolve) => setTimeout(resolve, latency));
};

function IsApiRequestTimeout(frequencyByTenRequest = 1) {
    return Math.random() < frequencyByTenRequest / 10;
}


function IsApiSuccessAfterTimeout(frequencyByTenRequest = 1) {
    return Math.random() < frequencyByTenRequest / 10;
}

//--------------------------------------------
function IsPropertyExist(data, property) {
    return Object.hasOwn(data, property)
}

//----------------------------------
function IsvalidImmatriculation(immatriculation) {
    const immatRegXp = new RegExp("^[A-Za-z]{2}-[0-9]+\-[A-Za-z]{2}$", "i")

    return immatRegXp.test(immatriculation)
}

//-----------------------------
function IsAllPropertyExist(...args) {
    const data = args[0]
    const lg = args.length;
    var response = true;
    for (var i = 1; i < lg; i++) {

        if (!IsPropertyExist(data, args[i])) {
            response = false;
            break;
        }
    }
    return response;
}


//-----------------------------------
router.get("/amendes", (req, res) => {
        console.log("Received request immat", req.query.immatriculation);

        const immatriculation = req.query.immatriculation;

        // 10% of the time, will timeout. Half of the time, the transaction is actually processed.
        const shouldTimeout = IsApiRequestTimeout();
        if (!IsPropertyExist(req.query, "immatriculation")) {

            console.log("invalid data");
            return simulateLatency(getResponseLag()).then(() => res.status(200).send(errorResponse));

        } else if (!IsvalidImmatriculation(immatriculation)) {
            console.log("invalid data");
            return simulateLatency(getResponseLag()).then(() => res.status(200).send(errorResponse));

        } else if (shouldTimeout) {
            const timeOutLag = getTimeoutLag();
            console.log("Will timeout");
            return simulateLatency(timeOutLag).then(() => res.status(504).send("Timeout"));
        } else {
            const amendes_responses = {
                immatriculation: immatriculation,
                montant: getRandomAmendesInCFA(100000),
                numeroLiquidation: getLiquidationByImmat(immatriculation)
            }
            const responseLag = getResponseLag();
            listeMontantLiquidation[amendes_responses.numeroLiquidation] = amendes_responses;
            listeStatusAmendes[amendes_responses.numeroLiquidation] = {

                montant: amendes_responses.montant,
                numeroLiquidation: amendes_responses.numeroLiquidation,
                status:"open",
            }
            return simulateLatency(responseLag).then(() => {
                    console.log(amendes_responses)
                    res.status(200).send(amendes_responses);
                }
            )
        }

    }
)
;

function getRequestStatus() {
    return Math.random() > 1 / 3 ? "completed" : "failed";
}

router.post("/cashout", (req, res, next) => {
    const paymentData = req.body;
    const numTelephone = paymentData.telephone
    const montantPayment = paymentData.montant
    const requestId = paymentData.requestId

    const shouldTimeout = IsApiRequestTimeout();

    if (!IsAllPropertyExist(paymentData, "telephone", "montant", "requestId")) {
        console.log("invalid data");
        return simulateLatency(getResponseLag()).then(() => res.status(200).send(errorResponse));
    }else if(requestId in listeStatusPayments){

        return simulateLatency(getResponseLag()).then(() => res.status(200).
        send({errorStatus:"429",errorMessage:"Duplicate request Id"}));
    } else if (shouldTimeout) {

        const paymentStatusAfterTimeout = getRequestStatus();
        listeStatusPayments[requestId] = {
            requestId: requestId,
            telephone: numTelephone,
            montant: montantPayment,
            status: paymentStatusAfterTimeout
        }
        console.log("payment Will timeout");
        return simulateLatency(getTimeoutLag()).then(() => res.status(504).send("Timeout"))
    } else {
        const paymentStatus = getRequestStatus();
        listeStatusPayments[requestId] = {
            requestId: requestId,
            telephone: numTelephone,
            montant: montantPayment,
            status: paymentStatus
        }
        const paymentReponse = listeStatusPayments[requestId];
        console.log("cash out data" + JSON.stringify(paymentReponse));
        return simulateLatency(getResponseLag()).then(() => {
                console.log(listeStatusPayments[requestId])
                res.status(200).send(paymentReponse);
            }
        )
    }
})

router.get("/cashout/status", (req, res, next) => {


    const requestId = req.query.requestId


    if (!IsPropertyExist(req.query, "requestId")) {
        console.log("invalid data");
        return simulateLatency(getResponseLag()).then(() => res.status(200).send(errorResponse));
    } else if (requestId in listeStatusPayments) {

        console.log("payment status " + requestId);
        return simulateLatency(getResponseLag()).then(() => res.status(200)
            .send(listeStatusPayments[requestId]))
    } else {
        const errorResponse = {errorCode: 404, errorMessage: "request id introuvable"}
        return simulateLatency(getResponseLag()).then(() => res.status(200)
            .send(errorResponse))

    }
})

router.post("/amendes/payment", (req, res, next) => {
    const paymentData = req.body;
    const montantPayment = paymentData.montant
    const liquidationId = paymentData.numeroLiquidation

    const shouldTimeout = IsApiRequestTimeout();

    if (!IsAllPropertyExist(paymentData, "montant", "numeroLiquidation")) {
        console.log("invalid data");
        return simulateLatency(getResponseLag()).then(() => res.status(200).send(errorResponse));
    } else if (!IsPropertyExist(listeMontantLiquidation, liquidationId)) {

        console.log("invalid data");
        return simulateLatency(getResponseLag()).then(() => res.status(200).send({
            errorStatus: 403,
            errorMessage: "Numero de liquidation introuvable"
        }));

    } else if (montantPayment != listeMontantLiquidation[liquidationId].montant) {

        console.log("invalid data");
        return simulateLatency(getResponseLag()).then(() => res.status(200).send({
            errorStatus: 403,
            errorMessage: "Montant de liquidation incorrecte"
        }));

    } else if (shouldTimeout) {

        const liquidationStatusAfterTimeout = getRequestStatus();
        listeStatusAmendes[liquidationId] = {

            numeroLiquidation: liquidationId,
            montant: montantPayment,
            status: liquidationStatusAfterTimeout
        }
        console.log("amendes liquidation Will timeout");
        return simulateLatency(getTimeoutLag()).then(() => res.status(504).send("Timeout"))
    } else {
        const liquidationStatus = getRequestStatus();
        listeStatusAmendes[liquidationId] = {
            numeroLiquidation: liquidationId,
            montant: montantPayment,
            status: liquidationStatus
        }
        const liquidationResponse = listeStatusAmendes[liquidationId];
        console.log("liquidation out data" + JSON.stringify(liquidationResponse));
        return simulateLatency(getResponseLag()).then(() => {
                console.log(listeStatusAmendes[liquidationId])
                res.status(200).send(liquidationResponse);
            }
        )
    }
})

router.get("/amendes/payment/status", (req, res, next) => {


    const liquidationId = req.query.numeroLiquidation

    if (!IsPropertyExist(req.query, "numeroLiquidation")) {

        console.log("invalid data");
        return simulateLatency(getResponseLag()).then(() => res.status(200).send(errorResponse));

    } else if (liquidationId in listeStatusAmendes) {

        console.log("liquidation status " + liquidationId);
        return simulateLatency(getResponseLag()).then(() => res.status(200)
            .send(listeStatusAmendes[liquidationId]))
    } else {
        const errorResponse = {errorCode: 404, errorMessage: "numero de liquidation introuvable"}
        return simulateLatency(getResponseLag()).then(() => res.status(200)
            .send(errorResponse))

    }
})


module.exports = router;
