

jQuery(document).ready(function($) {

	// Get Donations
	function pullDonationData(){
		$.ajax({
			type: 'GET',
			url: 'https://brooklynrail.org/.netlify/functions/getDonationData',
			data:{
				todo:"jsonp"
			},
			dataType: "jsonp",
			jsonpCallback: "rail_donations",
			crossDomain: true,
			cache:false,
			success: getDonationData,
			error:function(jqXHR, textStatus, errorThrown){
				console.log('error getting Donation Data');
				console.log(errorThrown);
			}
		});
	}
	pullDonationData()
	

	function getDonationData(data){
		console.log("data", data);
		// Get the Array of records
		jQuery(data.records).each(function(i, item) {
			var goal = 200000;
			var currentAmount = item.fields['Gross'];
			if (!!currentAmount && currentAmount != ""){
				var percentComplete = (currentAmount/goal)*100;
				var percentComplete = percentComplete > 10 ? (Math.round(percentComplete * 100) / 100)  : 15;
				
				$(".progressBar .currentAmountSlider").css({"width": percentComplete + '%'});
				$(".progressText .currentAmount").text('$' + currentAmount.toLocaleString());
			}
		})
	}
})
