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
	var stripe = Stripe("pk_live_etssu1WTxk1CFKZuGX9lBQOU00YxJbQofX"); // STRIPE_PUBLISHABLE
	// var stripe = Stripe(process.env.STRIPE_PUBLISHABLE); // STRIPE_PUBLISHABLE


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
		setTimeout(function (){
			check_donateReady();
			var current_value = $(amountInput).val();
			if (showFee() === false){
				if (current_value != 0){
					console.log('yes')
					update_fee(+current_value);
				}
			} else {
				var current_fee = $(amountInput).data("fee");
				if (current_value != 0){
					update_donateAmount(+current_value - +current_fee);
					update_fee(+current_value - +current_fee);
				}
			}
		}, 0);
	});



	function check_donateReady(){
		var value = $(amountInput).val();
		if (!value){
			submitButton.disabled = true; // adds the disabled attribute
			addHelper("Please enter an amount");
		} else {
			submitButton.disabled = false; // removes the disabled attribute
		}
	}

	// If the donate amount is over $1,000
	// Show the transaction fees
	// Prompt them to send in a check or money transfer
	function getFee(current_val){
		if (current_val == 0){ return 0 }

		var _fee = { Percent: 2.9, Fixed: 1.50 }
		var amount = parseFloat(current_val);

		// get the new Total
		var total = (amount + parseFloat(_fee.Fixed)) / (1 - parseFloat(_fee.Percent) / 100);
    var fee = total - amount;
		
		// save the original fee as a data-fee
		$(amountInput).data('fee', fee);
		return (Math.round(fee*Math.pow(10,2))/Math.pow(10,2)).toFixed(2)
	}

	function calc_donateAmount(amount){
		// update the amount
		switch (showFee()) {
			case true:
				var fee = getFee(amount);
				$(amountInput).data("fee", fee);
				var newAmount = (Math.round((+amount + +fee)*Math.pow(10,2))/Math.pow(10,2)).toFixed(2)
				return newAmount
			default:
				var fee = getFee(amount);
				$(amountInput).data("fee", fee);
				var newAmount = (Math.round(+amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) 
				return newAmount
		}
	}

	function update_donateAmount(newAmount){
		var donation = calc_donateAmount(newAmount)
		return $(amountInput).val(donation);
	}

	function update_fee(newAmount){
		var fee = getFee(newAmount);
		// update the transaction cost
		$('.transaction-fee-checkbox label span').text(`$${fee}`)
		return 
	}

	function showFee(){
		return $('#transaction-fee').prop("checked")
	}

	$('#transaction-fee').click(function(e){
		var current_value = $(amountInput).val();
		if (showFee() === true){
			if (current_value != 0){
				update_donateAmount(+current_value);
				update_fee(+current_value);
			}
		} else {
			var current_fee = $(amountInput).data("fee");
			if (current_value != 0){
				update_donateAmount(+current_value - +current_fee);
				update_fee(+current_value - +current_fee);
			}
		}
	});


	// Select the amount and auto-fill the input field
	$('.amount').click(function(e){
		e.preventDefault();
		var selected_amount = $(this).data("amount")
		update_donateAmount(selected_amount);
		update_fee(selected_amount);
		check_donateReady();
	});

	// btn-helper
	if (submitButton.disabled == true){
		$('.btn-helper').click(function(e){
			var text = "Please enter an amount";
			addHelper(text);
		});
	}
	
	function addHelper(text){
		$('.helper').text(text).fadeIn('fast');
	}
	function removeHelper(){
		$('.helper').text('').fadeOut('fast');
	}

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
