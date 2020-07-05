// Serverless Stripe Dontate form
// https://www.deanmontgomery.com/2019/09/18/building-a-serverless-donate-form/
// Example: https://github.com/monty5811/donate-form

// Environment variables:
// - STRIPE_PUBLISHABLE


jQuery(document).ready(function($) {
	var errorText = "Failed.";

	// look out for submit events on the form
	var submitButton = document.getElementById("btn-reg");
	var form = document.getElementById("reg-form");

	$('#btn-reg').click(function(e){
		e.preventDefault();
		console.log('clicked!');
		const buttonText = submitButton.innerText;
		submitButton.innerText = "Working...";

		var data = {
			email: $('#reg_email').val()
		};
		var dataJson = JSON.stringify(data);
		console.log('dataJson');
		console.log(dataJson);
		var netlify_function = 'https://'+window.location.hostname + '/.netlify/functions/signup/';
		console.log('netlify_function');
		console.log(netlify_function);

		// create a stripe session by talking to our netlify function
		$.ajax({
			type: "POST",
			url: netlify_function,
			data: dataJson,
			error: function(e) {
				console.log('error');
    		console.log(e);
  		},
			success: function(data) {
				console.log('success');
				console.log(data);
				// we got a response from our netlify function:
				// switch (data.status) {
				// 	case "session-created":
				// 		// it worked - send the user to checkout:
				// 		stripe
				// 			.redirectToCheckout({
				// 				sessionId: data.sessionId
				// 			})
				// 			.then(function(result) {
				// 				submitButton.innerText = result.error.message;
				// 			});
				// 		break;
				// 	default:
				// 		submitButton.innerText = errorText;
				// }
			},
			dataType: "json"
		});



	});
});
