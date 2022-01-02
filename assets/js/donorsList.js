
jQuery(document).ready(function($) {

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
	// pullDonorListData()
	

	function getDonorListData(data){
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
