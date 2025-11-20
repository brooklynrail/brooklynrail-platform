// Serverless Stripe Dontate form
// https://www.deanmontgomery.com/2019/09/18/building-a-serverless-donate-form/
// Example: https://github.com/monty5811/donate-form

// Environment variables:
// - STRIPE_PUBLISHABLE
// - STRIPE_PUBLISHABLE_TEST
// - STRIPE_SECRET
// - STRIPE_SECRET_TEST

const stripe = require("stripe")(process.env.STRIPE_SECRET); // get from ENV

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = function(event, context, callback) {

  // some error checking:
  if (event.httpMethod !== "POST" || !event.body) {
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "bad-payload" })
    });
  }
  //-- Parse the body contents into an object.
  const data = JSON.parse(event.body);

  //-- Make sure we have all required data. Otherwise, escape.
  if (!data.amount) {
    console.error("Required information is missing.");

    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ status: "missing-information" })
    });

    return;
  }
  // actually create the session with Stripe
  // we need to provide a couple of redirect urls:
  stripe.checkout.sessions.create(
    {
      success_url: "https://brooklynrail.org/thank-you",
      cancel_url: "https://brooklynrail.org/donation-canceled",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      payment_method_types: ["card"],
      submit_type: "donate",
      mode: "payment",
      payment_intent_data: {
        metadata: data.metadata,
      },
      line_items: [
        {
          name: "Brooklyn Rail Winter Campaign Donation",
          description: "Thank you for making a donation to the Brooklyn Rail's 2024 Winter Campaign",
          amount: data.amount,
          currency: "usd",
          quantity: 1
        }
      ],
    },
    function(err, session) {
      // asynchronously called
      if (err !== null) {
        console.log(err);
        callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: "session-create-failed" })
        });
      }
      // woohoo! it worked, send the session id back to the browser:
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "session-created",
          sessionId: session.id
        })
      });
    }
  );
};
