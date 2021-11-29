const Airtable = require('airtable')

exports.handler = function(event, context, callback) {
  
  var Airtable = require('airtable');
  // The Payments In Base == appsuINlr8VpP5zPm
  var base = new Airtable({apiKey: process.env.AIRTABLE_JZ}).base('appsuINlr8VpP5zPm');
  const allRecords = []
  // Campaigns table "tbldOazrsvPI1dh23"
  base('tbldOazrsvPI1dh23').select({
    // Selecting the first 3 records in All Ads:
    maxRecords: 1,
    // view: "2021 Winter Campaign"
    view: "viwmjobftcLot0jjZ",
  }).eachPage(function page(records, fetchNextPage) {
    
    records.forEach(function(record) {
      allRecords.push(record)
    })
    fetchNextPage()
  },

  function done(err) {
    if (err) {
      callback(err)
    } else {
      const body = "rail_donations(" + JSON.stringify({ records: allRecords })+ ")";
      
      const response = {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'Cache-Control: max-age=60, public'
        },
        statusCode: 200,
        body: body
      }
      
      callback(null, response)
    }
  })
}