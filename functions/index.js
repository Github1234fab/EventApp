
// const { onRequest } = require("firebase-functions/v2/https");
// const { setGlobalOptions } = require("firebase-functions/v2");
// const admin = require("firebase-admin");
// const cors = require("cors")({ origin: true });

// // Init Admin SDK (Firestore, Auth)
// admin.initializeApp();

// // Region + secrets (définis avec `firebase functions:secrets:set ...`)
// setGlobalOptions({
//   region: "us-central1",
//   secrets: ["STRIPE_SECRET", "STRIPE_WEBHOOK_SECRET"],
// });

// /**
//  * Crée une session Stripe Checkout et renvoie son URL.
//  * POST { submissionId: string, price: number (en centimes) }
//  * Réponse: { url: string }
//  */
// // functions/index.js (extrait)
// // ...
// exports.createCheckoutSession = onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     try {
//       if (req.method !== "POST") return res.status(405).send("Method not allowed");

//       const stripe = require("stripe")(process.env.STRIPE_SECRET);

//       const { submissionId, price, returnUrl } = req.body || {};
//       if (!submissionId || typeof price !== "number" || price < 50) {
//         return res.status(400).json({ error: "submissionId et price (>=50) requis" });
//       }

//       // Utilise l’URL renvoyée par l’app si fournie, sinon fallback
//       const success_url = returnUrl || "https://example.com/success";
//       const cancel_url  = returnUrl || "https://example.com/cancel";

//       const session = await stripe.checkout.sessions.create({
//         mode: "payment",
//         line_items: [
//           {
//             price_data: {
//               currency: "eur",
//               product_data: { name: "Annonce" },
//               unit_amount: price, // centimes
//             },
//             quantity: 1,
//           },
//         ],
//         success_url,
//         cancel_url,
//         client_reference_id: submissionId,
//         metadata: { submissionId },
//       });

//       return res.json({ url: session.url });
//     } catch (e) {
//       console.error("[createCheckoutSession]", e);
//       return res.status(500).json({ error: e.message });
//     }
//   });
// });


// /**
//  * Webhook Stripe : marque l’annonce comme payée quand le Checkout est complété.
//  * Écoute: checkout.session.completed
//  * ⚠️ Ne pas utiliser de middleware qui modifie le body : on lit req.rawBody pour vérifier la signature.
//  */
// exports.stripeWebhook = onRequest(
//   // Les secrets et la région sont déjà définis globalement, pas besoin de les répéter ici.
//   async (req, res) => {
//     if (req.method !== "POST") {
//       return res.status(405).send("Method not allowed");
//     }

//     try {
//       const stripe = require("stripe")(process.env.STRIPE_SECRET);
//       const sig = req.headers["stripe-signature"];
//       const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//       // Vérifie la signature avec le rawBody (important)
//       let event;
//       try {
//         event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
//       } catch (err) {
//         console.error("Webhook signature verification failed:", err.message);
//         // 400 => Stripe réessaiera
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//       }

//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         const submissionId = session.client_reference_id || session.metadata?.submissionId;

//         if (submissionId) {
//           await admin
//             .firestore()
//             .collection("Submissions")
//             .doc(submissionId)
//             .update({
//               paid: true,
//               paidAt: admin.firestore.FieldValue.serverTimestamp(),
//               stripeSessionId: session.id,
//             });
//         }
//       }

//       return res.status(200).send("ok");
//     } catch (e) {
//       console.error("[stripeWebhook]", e);
//       return res.status(500).send("server error");
//     }
//   }
// );



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
 * POST { submissionId: string, price: number (en centimes), returnUrl?: string }
 * Réponse: { url: string }
 */
exports.createCheckoutSession = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== "POST") return res.status(405).send("Method not allowed");

      const stripe = require("stripe")(process.env.STRIPE_SECRET);

      const { submissionId, price, returnUrl } = req.body || {};
      if (!submissionId || typeof price !== "number" || price < 50) {
        return res.status(400).json({ error: "submissionId et price (>=50) requis" });
      }

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
 * ⚠️ Important: on lit req.rawBody pour vérifier la signature.
 */
exports.stripeWebhook = onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET);
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      console.error("[stripeWebhook] Signature invalide:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("[stripeWebhook] Event reçu:", {
      id: event.id,
      type: event.type,
      api_version: event.api_version,
      created: event.created,
      livemode: event.livemode,
    });

    if (event.type !== "checkout.session.completed") {
      console.log("[stripeWebhook] Event ignoré:", event.type);
      return res.status(200).send("ignored");
    }

    const session = event.data.object;

    // ID Firestore attendu
    const submissionId = (session.client_reference_id || session.metadata?.submissionId || "").trim();

    console.log("[stripeWebhook] checkout.session.completed", {
      sessionId: session.id,
      client_reference_id: session.client_reference_id,
      metadata: session.metadata,
      resolvedSubmissionId: submissionId,
      payment_intent: session.payment_intent,
    });

    if (!submissionId) {
      console.error("[stripeWebhook] Aucun submissionId trouvé dans la session.");
      return res.status(200).send("no submissionId");
    }

    // On récupère + enrichit avec le PaymentIntent (montant / monnaie / email client)
    let amount_total = session.amount_total ?? null;
    let currency = session.currency ?? null;
    let customer_email = session.customer_details?.email ?? session.customer_email ?? null;
    let payment_intent_id = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

    try {
      if (!amount_total || !currency || !customer_email || !payment_intent_id) {
        if (payment_intent_id) {
          const pi = await stripe.paymentIntents.retrieve(payment_intent_id);
          amount_total = amount_total ?? pi.amount;
          currency = currency ?? pi.currency;
          customer_email = customer_email ?? pi.receipt_email ?? null;
        }
      }
    } catch (piErr) {
      console.warn("[stripeWebhook] Impossible d'enrichir via PaymentIntent:", piErr?.message);
    }

    const db = admin.firestore();
    const docRef = db.collection("Submissions").doc(submissionId);

    // Anti-doublon + update enrichi
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);

      // Si le doc n’existe pas encore, on le crée en minimal (merge plus tard)
      if (!snap.exists) {
        tx.set(docRef, { createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      } else {
        const data = snap.data() || {};
        if (data.paid === true) {
          console.log("[stripeWebhook] Déjà payé, on ne fait rien pour", submissionId);
          return;
        }
      }

      tx.set(
        docRef,
        {
          paid: true,
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          stripeSessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email || null,
          paymentIntent: session.payment_intent || null,
        },
        { merge: true }
      );
    });

    console.log("[stripeWebhook] Firestore OK pour", submissionId);
    return res.status(200).send("ok");
  } catch (e) {
    console.error("[stripeWebhook] Unexpected ERROR", e);
    return res.status(500).send("server error");
  }
});
