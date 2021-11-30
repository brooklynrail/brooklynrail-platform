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
	
	// var stripe = Stripe("pk_test_ykFiEaft3Qg1H0Wew5lXhDvM00jXCg2uo5"); // STRIPE_PUBLISHABLE_TEST
	// var stripe = Stripe(process.env.STRIPE_PUBLISHABLE); // STRIPE_PUBLISHABLE
	
	var apiURL = "https://brooklynrail.netlify.app/.netlify/functions/stripe"
	// var apiURL = "https://brooklynrail.netlify.app/.netlify/functions/stripe_test"
	// var apiURL = "http://localhost:8888/.netlify/functions/stripe_test"
	// var apiURL = "http://localhost:8888/.netlify/functions/stripe"



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
		$('.transaction-fee-checkbox label .fee').text(`$${fee}`)
		return 
	}

	function largeDonation(newAmount){
		var fee = getFee(newAmount);
		// update the transaction cost
		addHelper("wow, this is big");
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
	$('#showAddress a').click(function(e){
		e.preventDefault();
		$('#mailAddress').toggle();
		
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

		var transaction_type = document.getElementById("transaction_type").value
		var name = transaction_type == "donation" ? "2021 Winter Campaign Donation" : "Rail Endowment Contribution"
		var description = transaction_type == "donation" ? "Thank you for making a donation to the Brooklyn Rail's 2021 Winter Campaign" : "Thank you for making a donation to the Brooklyn Rail's Endowment"

		// get the current value in the input
		// The data object we're passing to the Stripe session
		// NOTE: the amount needs to be calculated as cents!
		var data = {
			amount: document.getElementById("donate-amount").valueAsNumber * 100,
			name: name,
			description: description,
			metadata: { 
				payment_type: "online donation",
				consentGiven: consentGiven(),
				donationName: document.getElementById("donorName").value,
				donationInstagram: document.getElementById("instagramHandle").value,
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

	var end = new Date('12/31/2021 11:59 PM');
	var _second = 1000;
	var _minute = _second * 60;
	var _hour = _minute * 60;
	var _day = _hour * 24;
	var timer;

	function showRemaining() {
			var now = new Date();
			var distance = end - now;
			if (distance < 0) {

				clearInterval(timer);
				document.getElementById('countdown').innerHTML = 'EXPIRED!';

				return;
			}
			var days = Math.floor(distance / _day);
			var hours = Math.floor((distance % _day) / _hour);
			var minutes = Math.floor((distance % _hour) / _minute);
			var seconds = Math.floor((distance % _minute) / _second);

			document.getElementById('countdown').innerHTML = '<span>' + days + ' <span>days</span></span> ';
			document.getElementById('countdown').innerHTML += '<span>' + hours + ' <span>hours</span></span> ';
			document.getElementById('countdown').innerHTML += '<span>' + minutes + ' <span>mins</span></span> ';
			document.getElementById('countdown').innerHTML += '<span>' + seconds + ' <span>secs</span></span>';
	}

	timer = setInterval(showRemaining, 1000);


	// Get Donor List
	function pullDonorListData(){
		$.ajax({
			type: 'GET',
			url: 'https://brooklynrail.org/.netlify/functions/getDonorList',
			data:{
				todo:"jsonp"
			},
			dataType: "jsonp",
			jsonpCallback: "rail_donorList",
			crossDomain: true,
			cache:false,
			success: getDonorListData,
			error:function(jqXHR, textStatus, errorThrown){
				console.log('error getting Hat Data');
				console.log(errorThrown);
			}
		});
	}
	pullDonorListData()
	

	function getDonorListData(data){
		console.log(data);
		var donationList = [];
		// Get the Array of records
		jQuery(data.records).each(function(i, item) {
			var consent = item.fields['Consent'];
			// If consent is true
			if(consent == true) {
				// push it to donationList
				donationList.push(item);
			}
		})
		showDonorList(donationList)
	}

	function showDonorList(data){
		var donorList = [];
		
		// Get the Array of records
		$(data).each(function(i, item) {
			var donationNamePublic = item.fields['Donation name public'];
			var donationName = !!donationNamePublic && donationNamePublic != "" ? donationNamePublic : item.fields['Donation name']
			var donationInstagram = item.fields['Instagram handle']
			if (!!donationInstagram && donationInstagram != ""){
				var donationInstagram = donationInstagram.replaceAll('@', '') 
				var donor = '<li>'+ donationName + ' <a title="Follow '+donationName+' on Instagram" href="https://instagram.com/'+ donationInstagram +'"><i class="fab fa-instagram"></i><span>'+ donationInstagram +'</span></a> </li>';
			} else {
				var donor = '<li>'+ donationName +'</li>';
			}
			
			// push it to donorList
			donorList.push(donor);
		});
		!!donorList && donorList != "" ? jQuery(".donorsList").html(donorList.join("\n")) : "";
	}
})
