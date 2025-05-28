var express = require('express');
var router = express.Router();



const listeLiquidation={}
const listeMontantLiquidation={}
const listeStatusPayments={}
const listeStatusAmendes={}
const getResponseLag = () => Math.random() * (5_000 - 200) + 200;
const getWebhookLag = () => Math.random() * (30_000 - 10_000) + 10_000;
const getTimeoutLag = () => Math.random() * 10_000;
const getRandomLiq = () => "LIQ-"+Math.floor(Math.random() * 10000);

const getRandomAmendesInCFA = function (max) {

  const montantAmendesRandom = Math.floor(Math.random() * max);
  const quotientBy500 = Math.floor(montantAmendesRandom / 500)
  return (quotientBy500 + 1) * 500
}
//------------------------------------------------
const getLiquidationByImmat=function (immat){
  let response=getRandomLiq();
  if(immat in listeLiquidation){
    response=listeLiquidation[immat]
  }else{
    listeLiquidation[immat]=response;
  }

  return response;
}
//-------------------------------------------
const simulateLatency = (latency) => {
  return new Promise((resolve) => setTimeout(resolve, latency));
};

//--------------------------------------------
router.get("/amendes", (req, res) => {
  console.log("Received request immat", req.query.immatriculation);
  const status = Math.random() > 1 / 3 ? "completed" : "declined";
  const immatriculation = req.query.immatriculation;

  // 10% of the time, will timeout. Half of the time, the transaction is actually processed.
  const shouldTimeout = Math.random() < 1 / 10;
  if (shouldTimeout) {
    const timeOutLag = getTimeoutLag();
    console.log("Will timeout");
    return simulateLatency(timeOutLag).then(() => res.status(504).send("Timeout"));
  } else {
    const amendes_responses = {immatriculation: immatriculation,
      montant: getRandomAmendesInCFA(100000),
      numero_liquidation:getLiquidationByImmat(immatriculation)
    }
    const responseLag = getResponseLag();
    return simulateLatency(responseLag).then(() => {
          console.log(amendes_responses)
          res.status(200).send(amendes_responses);
        }
    )
  }

});

router.post("/payments",(req, res, next) => {
  const paymentData=req.body;
})
module.exports = router;
