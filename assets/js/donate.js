jQuery(document).ready(function($) {
	var errorText = "Failed. You have not been charged.";

	// look out for submit events on the form
	var submitButton = document.getElementById("btn-donate");
	var amountInput = document.getElementById("donate-amount");
	
	var stripe = Stripe("pk_live_etssu1WTxk1CFKZuGX9lBQOU00YxJbQofX"); // STRIPE_PUBLISHABLE
	// var stripe = Stripe(process.env.STRIPE_PUBLISHABLE); // STRIPE_PUBLISHABLE
	
	// var stripe = Stripe("pk_test_ykFiEaft3Qg1H0Wew5lXhDvM00jXCg2uo5"); // STRIPE_PUBLISHABLE_TEST
	// var stripe = Stripe(process.env.STRIPE_PUBLISHABLE); // STRIPE_PUBLISHABLE
	
	var apiURL = "https://brooklynrail.netlify.app/.netlify/functions/stripe"
	// var apiURL = "https://brooklynrail.netlify.app/.netlify/functions/stripe_test"
	// var apiURL = "http://localhost:8888/.netlify/functions/stripe_test"
	// var apiURL = "http://localhost:8888/.netlify/functions/stripe"

	// Function to get URL parameters
	function getUrlParameter(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	// Pre-populate the donate amount if "amt" parameter is present
	var amt = getUrlParameter('amt');
	if (amt) {
		$(amountInput).val(amt);
		update_fee(amt);
		check_donateReady();
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
					update_fee(+current_value);
					// largeDonation(+current_value);
				}
			} else {
				var current_fee = $(amountInput).data("fee");
				if (current_value != 0){
					update_donateAmount(+current_value - +current_fee);
					update_fee(+current_value - +current_fee);
					// largeDonation(+current_value - +current_fee);
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

		var _fee = { Percent: 2.9, Fixed: 0.30 }
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
		$('.transaction-fee-checkbox label .fee').text(`$${fee}`)
		return 
	}

	function largeDonation(newAmount){
		var fee = getFee(newAmount);
		// update the transaction cost
		addHelper("");
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

	
	// Donation buttons
	// Select the amount and auto-fill the input field
	$('.amount').click(function(e){
		e.preventDefault();
		confetti({
			particleCount: 100,
			spread: 180
		});
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

	// Mail a check
	// =======================
	$('#showAddress .mail').click(function(e){
		e.preventDefault();
		$('#mailAddress').toggle();
		$('#wireAddress').hide();
	});

	// Send a wire
	// =======================
	$('#showAddress .wire').click(function(e){
		e.preventDefault();
		$('#mailAddress').hide();
		$('#wireAddress').toggle();
	});


	// Share Prompt
	// Check if the person has given consent to share their info in the donations list
	// =======================
	function consentGiven(){
		if($('#consent').is(":checked")){
			$('#donorName').prop("disabled", true);
			$('#instagramHandle').prop("disabled", true);
			$('.shareDetails').addClass('disabled');
			return "false";
		} else{
			$('#donorName').prop("disabled", false);
			$('#instagramHandle').prop("disabled", false);
			$('.shareDetails').removeClass('disabled');
			return "true";
		}
	}
	consentGiven()

	$('#consent').click(function(e){
		consentGiven()
	});
	
	//get the instagram photo
	function getPhoto(a) {
  // validation for instagram usernames
  var regex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
  var validation = regex.test(a);

  if(validation) {
  
	$.get("https://www.instagram.com/"+a+"/?__a=1")
	.done(function(data) { 

	  // getting the url
	  var photoURL = data["graphql"]["user"]["profile_pic_url_hd"];

	  // update img element
	  $("#photoReturn").attr("src",photoURL)
	 
	 })
	.fail(function() { 
	  // code for 404 error 
	  alert('Username was not found!')
	})
  
  } else {
  
	alert('The username is invalid!')
  }

}

	$('#btn-donate').click(function(e){
		e.preventDefault();
		const buttonText = submitButton.innerText;
		submitButton.innerText = "Working...";

		var transaction_type = document.getElementById("transaction-type").value
		var name = transaction_type == "donation" ? "2024 Winter Campaign Donation" : "Brooklyn Rail Endowment"
		var description = transaction_type == "donation" ? "Thank you for making a donation to the Brooklyn Rail's 2024 Winter Campaign" : "Thank you for making a donation to the Brooklyn Rail's Endowment"
		var donationName = !!document.getElementById("donorName") ? document.getElementById("donorName").value : ""
		var donationInstagram = !!document.getElementById("instagramHandle") ? document.getElementById("instagramHandle").value : ""
		var consent = transaction_type == "donation" ? consentGiven() : "false"
		var success_url = transaction_type == "donation" ? "https://brooklynrail.org/thank-you" : "https://brooklynrail.org/thank-you-endowment"

		// get the current value in the input
		// The data object we're passing to the Stripe session
		// NOTE: the amount needs to be calculated as cents!
		var data = {
			amount: document.getElementById("donate-amount").valueAsNumber * 100,
			name: name,
			description: description,
			success_url: success_url,
			metadata: { 
				payment_type: "online donation",
				consentGiven: consent,
				donationName: donationName,
				donationInstagram: donationInstagram,
			},
		};
		var dataJson = JSON.stringify(data);

		// create a stripe session by talking to our netlify function
		$.ajax({
			type: "POST",
			url: apiURL,
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

	var end = new Date('12/31/2024 11:59 PM');
	var _second = 1000;
	var _minute = _second * 60;
	var _hour = _minute * 60;
	var _day = _hour * 24;
	var timer;

	function showRemaining() {
		var countdown = document.getElementById('countdown')
		if (!!countdown){
			var now = new Date();
			var distance = end - now;
			if (distance < 0) {

				clearInterval(timer);
				document.getElementById('countdown').remove()

				return;
			}

			var days = Math.floor(distance / _day);
			var hours = Math.floor((distance % _day) / _hour);
			var minutes = Math.floor((distance % _hour) / _minute);
			var seconds = Math.floor((distance % _minute) / _second);

			document.getElementById('countdown').innerHTML = '<span>' + days + ' <span>days</span></span> ';
			document.getElementById('countdown').innerHTML += '<span>' + hours + ' <span>hours</span></span> ';
			document.getElementById('countdown').innerHTML += '<span>' + minutes + ' <span>mins</span></span> ';
			// document.getElementById('countdown').innerHTML += '<span>' + seconds + ' <span>secs</span></span>';
		}
	}

	timer = setInterval(showRemaining, 1000);
})
