const Airtable = require('airtable')

exports.handler = function(event, context, callback) {
  
  var Airtable = require('airtable');
  // The Payments In Base == appsuINlr8VpP5zPm
  var base = new Airtable({apiKey: process.env.AIRTABLE_JZ}).base('appsuINlr8VpP5zPm');
  const allRecords = []
  // Stripe Payments table "tblDFk7aff4M5UwlR"
  base('tblDFk7aff4M5UwlR').select({
    // Selecting the first 3 records in 2021 Winter Campaign:
    maxRecords: 30,
    // view: "2021 Winter Campaign"
    view: "viwmUezamtIaUARgv",
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
      console.log(allRecords.length)
      const body = "rail_donorList(" + JSON.stringify({ records: allRecords })+ ")";
      
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