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

	// Handle input changes
	// When the user types, only update the fee display, don't modify their input
	$(amountInput).on('input', function() {
		check_donateReady();
		var current_value = $(amountInput).val();
		
		if (current_value && current_value != 0) {
			// Always calculate fee based on the raw input value
			// Don't modify the input field while the user is typing
			update_fee(+current_value);
		}
	});

	function check_donateReady() {
		var value = $(amountInput).val();
		if (!value) {
			submitButton.disabled = true;
			addHelper("Please enter an amount");
		} else {
			submitButton.disabled = false;
			removeHelper();
		}
	}

	// Calculate the Stripe processing fee for a given donation amount
	// Stripe charges 2.9% + $0.30 per transaction
	function getFee(donationAmount) {
		if (donationAmount == 0) { 
			return 0;
		}

		var feePercent = 2.9;
		var feeFixed = 0.30;
		var amount = parseFloat(donationAmount);

		// Calculate total charge needed to cover donation + fees
		var totalCharge = (amount + feeFixed) / (1 - feePercent / 100);
		var fee = totalCharge - amount;
		
		// Store the fee for later use
		$(amountInput).data('fee', fee);
		return (Math.round(fee * 100) / 100).toFixed(2);
	}

	function update_fee(donationAmount) {
		var fee = getFee(donationAmount);
		$('.transaction-fee-checkbox label .fee').text(`$${fee}`);
	}

	function showFee() {
		return $('#transaction-fee').prop("checked");
	}

	// Handle the processing fee checkbox
	$('#transaction-fee').change(function() {
		var current_value = parseFloat($(amountInput).val());
		
		if (!current_value || current_value == 0) {
			return;
		}

		if (showFee()) {
			// Checkbox was just checked - add the fee to the current amount
			var fee = parseFloat(getFee(current_value));
			var newTotal = (Math.round((current_value + fee) * 100) / 100).toFixed(2);
			$(amountInput).val(newTotal);
		} else {
			// Checkbox was just unchecked - subtract the fee from the current amount
			var current_fee = parseFloat($(amountInput).data("fee"));
			var newAmount = (Math.round((current_value - current_fee) * 100) / 100).toFixed(2);
			$(amountInput).val(newAmount);
			update_fee(newAmount);
		}
	});

	// Donation amount buttons
	// Select a preset amount and auto-fill the input field
	$('.amount').click(function(e) {
		e.preventDefault();
		confetti({
			particleCount: 100,
			spread: 180
		});
		
		var selected_amount = $(this).data("amount");
		var fee = parseFloat(getFee(selected_amount));
		
		// If fee checkbox is checked, add fee to the amount
		if (showFee()) {
			var total = (Math.round((selected_amount + fee) * 100) / 100).toFixed(2);
			$(amountInput).val(total);
		} else {
			$(amountInput).val(selected_amount);
		}
		
		update_fee(selected_amount);
		check_donateReady();
	});

	// Helper text functions
	function addHelper(text) {
		$('.helper').text(text).fadeIn('fast');
	}
	
	function removeHelper() {
		$('.helper').text('').fadeOut('fast');
	}

	// btn-helper
	if (submitButton.disabled == true) {
		$('.btn-helper').click(function(e) {
			var text = "Please enter an amount";
			addHelper(text);
		});
	}

	// Mail a check
	$('#showAddress .mail').click(function(e) {
		e.preventDefault();
		$('#mailAddress').toggle();
		$('#wireAddress').hide();
	});

	// Send a wire transfer
	$('#showAddress .wire').click(function(e) {
		e.preventDefault();
		$('#mailAddress').hide();
		$('#wireAddress').toggle();
	});

	// Share Prompt
	// Check if the person has given consent to share their info in the donations list
	function consentGiven() {
		if ($('#consent').is(":checked")) {
			$('#donorName').prop("disabled", true);
			$('#instagramHandle').prop("disabled", true);
			$('.shareDetails').addClass('disabled');
			return "false";
		} else {
			$('#donorName').prop("disabled", false);
			$('#instagramHandle').prop("disabled", false);
			$('.shareDetails').removeClass('disabled');
			return "true";
		}
	}
	consentGiven();

	$('#consent').click(function(e) {
		consentGiven();
	});
	
	// Get Instagram photo (Note: Instagram API changes may break this)
	function getPhoto(username) {
		// Validation for instagram usernames
		var regex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/);
		var validation = regex.test(username);

		if (validation) {
			$.get("https://www.instagram.com/" + username + "/?__a=1")
				.done(function(data) {
					var photoURL = data["graphql"]["user"]["profile_pic_url_hd"];
					$("#photoReturn").attr("src", photoURL);
				})
				.fail(function() {
					alert('Username was not found!');
				});
		} else {
			alert('The username is invalid!');
		}
	}

	// Handle donation form submission
	$('#btn-donate').click(function(e) {
		e.preventDefault();
		const buttonText = submitButton.innerText;
		submitButton.innerText = "Working...";

		var transaction_type = document.getElementById("transaction-type").value;
		var name = transaction_type == "donation" ? "2025 Winter Campaign Donation" : "Brooklyn Rail Endowment";
		var description = transaction_type == "donation" 
			? "Thank you for making a donation to the Brooklyn Rail's 2025 Winter Campaign" 
			: "Thank you for making a donation to the Brooklyn Rail's Endowment";
		var donationName = !!document.getElementById("donorName") ? document.getElementById("donorName").value : "";
		var donationInstagram = !!document.getElementById("instagramHandle") ? document.getElementById("instagramHandle").value : "";
		var consent = transaction_type == "donation" ? consentGiven() : "false";
		var success_url = transaction_type == "donation" 
			? "https://brooklynrail.org/thank-you" 
			: "https://brooklynrail.org/thank-you-endowment";

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

		// Create a Stripe session by talking to our Netlify function
		$.ajax({
			type: "POST",
			url: apiURL,
			data: dataJson,
			error: function(e) {
				console.log(e);
				submitButton.innerText = errorText;
			},
			success: function(data) {
				// We got a response from our Netlify function
				switch (data.status) {
					case "session-created":
						// It worked - send the user to Stripe checkout
						stripe.redirectToCheckout({
							sessionId: data.sessionId
						}).then(function(result) {
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

	// Countdown timer
	var end = new Date('12/31/2025 11:59 PM');
	var _second = 1000;
	var _minute = _second * 60;
	var _hour = _minute * 60;
	var _day = _hour * 24;
	var timer;

	function showRemaining() {
		var countdown = document.getElementById('countdown');
		if (!!countdown) {
			var now = new Date();
			var distance = end - now;
			
			if (distance < 0) {
				clearInterval(timer);
				document.getElementById('countdown').remove();
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
});
