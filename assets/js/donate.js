// Serverless Stripe Dontate form
// https://www.deanmontgomery.com/2019/09/18/building-a-serverless-donate-form/
// Example: https://github.com/monty5811/donate-form

// Environment variables:
// - STRIPE_PUBLISHABLE
// - STRIPE_PUBLISHABLE_TEST
// - STRIPE_SECRET
// - STRIPE_SECRET_TEST

jQuery(document).ready(function($) {
	var errorText = "Failed. You have not been charged.";

	// look out for submit events on the form
	var submitButton = document.getElementById("btn-donate");
	var amountInput = document.getElementById("donate-amount");
	// var stripe = Stripe("pk_live_etssu1WTxk1CFKZuGX9lBQOU00YxJbQofX"); // STRIPE_PUBLISHABLE
	var stripe = Stripe(process.env.STRIPE_PUBLISHABLE); // STRIPE_PUBLISHABLE
	

	// Gets all the checked checkboxes
	function get_checked(){
		var features = [];
    $('#donate-form input[type="checkbox"]:checked').each(function() {
      features.push($(this).val());
    });
		return features.join(', ');
	}

	// Check if the amountInput field has a value on keyup
	// If it is empty, make it disabled, otherwise make it enabled and ready to submit
	// This also accounts for people who enter a value then deleted it
	$(amountInput).keyup(function(){
		var value = $(amountInput).val();
		if (!value){
			submitButton.disabled = true; // adds the disabled attribute
		} else {
			submitButton.disabled = false; // removes the disabled attribute
		}
	});


	$('#btn-donate').click(function(e){
		e.preventDefault();
		const buttonText = submitButton.innerText;
		submitButton.innerText = "Working...";

		var data = {
			amount: document.getElementById("donate-amount").valueAsNumber * 100,
			type: get_checked()
		};

		var dataJson = JSON.stringify(data);


		// create a stripe session by talking to our netlify function
		$.ajax({
			type: "POST",
			url: "https://brooklynrail.netlify.app/.netlify/functions/get_checkout_session",
			data: dataJson,
			error: function(e) {
    		console.log(e);
  		},
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
