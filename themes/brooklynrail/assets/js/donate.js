jQuery(document).ready(function($) {

	var errorText = "Failed. You have not been charged.";

	// look out for submit events on the form
	document.addEventListener("DOMContentLoaded", function(event) {
		var submitButton = document.getElementById("giving-button");
		var stripe = Stripe("STRIPE_PUBLISHABLE_TEST");

		var form = document.getElementById("payment-form");
		form.addEventListener("submit", function(event) {
			event.preventDefault();
			const buttonText = submitButton.innerText;
			submitButton.innerText = "Working...";

			var data = {
				amount: document.getElementById("giving-amount").valueAsNumber * 100,
			};

			// create a stripe session by talking to our netlify function
			$.ajax({
				type: "POST",
				url: "/netlify/get_checkout_session/",
				data: JSON.stringify(data),
				success: function(data) {
					// we got a response from our netlify function:
					switch (data.status) {
						case "session-created":
							// it worked - send the user to checkout:
							stripe
								.redirectToCheckout({
									sessionId: data.sessionId
								})
								.then(function(result) {
									submitButton.innerText = result.error.message;
								});
							break;
						default:
							submitButton.innerText = errorText;
					}
				},
				dataType: "json"
			});
		});
	});

});
