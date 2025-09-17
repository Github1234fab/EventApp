// functions/index.js

// Cloud Functions v2 (HTTP)
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Init Admin SDK (Firestore, Auth)
admin.initializeApp();

// Region + secrets (définis avec `firebase functions:secrets:set ...`)
setGlobalOptions({
  region: "us-central1",
  secrets: ["STRIPE_SECRET", "STRIPE_WEBHOOK_SECRET"],
});

/**
 * Crée une session Stripe Checkout et renvoie son URL.
 * POST { submissionId: string, price: number (en centimes) }
 * Réponse: { url: string }
 */
// functions/index.js (extrait)
// ...
exports.createCheckoutSession = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== "POST") return res.status(405).send("Method not allowed");

      const stripe = require("stripe")(process.env.STRIPE_SECRET);

      const { submissionId, price, returnUrl } = req.body || {};
      if (!submissionId || typeof price !== "number" || price < 50) {
        return res.status(400).json({ error: "submissionId et price (>=50) requis" });
      }

      // Utilise l’URL renvoyée par l’app si fournie, sinon fallback
      const success_url = returnUrl || "https://example.com/success";
      const cancel_url  = returnUrl || "https://example.com/cancel";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: "Annonce" },
              unit_amount: price, // centimes
            },
            quantity: 1,
          },
        ],
        success_url,
        cancel_url,
        client_reference_id: submissionId,
        metadata: { submissionId },
      });

      return res.json({ url: session.url });
    } catch (e) {
      console.error("[createCheckoutSession]", e);
      return res.status(500).json({ error: e.message });
    }
  });
});


/**
 * Webhook Stripe : marque l’annonce comme payée quand le Checkout est complété.
 * Écoute: checkout.session.completed
 * ⚠️ Ne pas utiliser de middleware qui modifie le body : on lit req.rawBody pour vérifier la signature.
 */
exports.stripeWebhook = onRequest(
  // Les secrets et la région sont déjà définis globalement, pas besoin de les répéter ici.
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    try {
      const stripe = require("stripe")(process.env.STRIPE_SECRET);
      const sig = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      // Vérifie la signature avec le rawBody (important)
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        // 400 => Stripe réessaiera
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const submissionId = session.client_reference_id || session.metadata?.submissionId;

        if (submissionId) {
          await admin
            .firestore()
            .collection("Submissions")
            .doc(submissionId)
            .update({
              paid: true,
              paidAt: admin.firestore.FieldValue.serverTimestamp(),
              stripeSessionId: session.id,
            });
        }
      }

      return res.status(200).send("ok");
    } catch (e) {
      console.error("[stripeWebhook]", e);
      return res.status(500).send("server error");
    }
  }
);
