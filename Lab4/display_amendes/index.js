const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const getResponseLag = () => Math.random() * (10_000 - 200) + 200;
const getWebhookLag = () => Math.random() * (30_000 - 10_000) + 10_000;
const getTimeoutLag = () => Math.random() * (120_000 - 30_000) + 30_000;
const amendes = {};

const simulateLatency = (latency) => {
  return new Promise((resolve) => setTimeout(resolve, latency));
};

const sendWebhook = (id) => {
  const { status, webhookUrl } = amendes[id];
  axios
    .post(webhookUrl, { id, status })
    .catch(() => console.log(`Could not post webhook for ${id}`));
};

app.get("/amendes", (req, res) => {
  console.log("Received request immat", req.query.immatriculation);
  const status = Math.random() > 1 / 3 ? "completed" : "declined";
  const { immatriculation, webhookUrl } = req.params.immatriculation;

  // 10% of the time, will timeout. Half of the time, the transaction is actually processed.
  const shouldTimeout = Math.random() < 1 / 10;
  if (shouldTimeout) {
    console.log("Will timeout");
    const shouldWork = Math.random() > 1 / 2;
    if (shouldWork) {
      simulateLatency(getTimeoutLag()).then(() => {
        amendes[immatriculation] = { id, status, webhookUrl };
      });
    }
    return simulateLatency(30_000).then(() => res.status(504).send("Timeout"));
  }

  // Persist the transaction in memory
  amendes[id] = { id, status: "pending", webhookUrl };

  // Schedule webhook, for 80% of the cases
  const shouldSendWebhook = Math.random() > 1 / 5;
  if (shouldSendWebhook) {
    simulateLatency(getWebhookLag()).then(() => sendWebhook(id));
  }

  // Return the response otherwise
  simulateLatency(getResponseLag()).then(() => {
    amendes[id].newStatusRequested = status;
    res.send(amendes[id]);
  });
});

app.get("/transaction/:id", (req, res) => {
  const transaction = amendes[req.params.id];
  if (transaction === undefined) {
    res.status(404).send();
  } else {
    res.send(transaction);
  }
});

app.listen(port, () => {
  console.log(`Third party mock is listening on port ${port}`);
});
