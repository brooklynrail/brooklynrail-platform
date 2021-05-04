const Airtable = require('airtable')

exports.handler = function(event, context, callback) {
  
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.AIRTABLE_JZ}).base('appaBcfR59hX27DNi');
  const allRecords = []
  base('Web Ads').select({
    // Selecting the first 3 records in All Ads:
    maxRecords: 15,
    // view: "All Ads", // All Ads view
    view: "viwHVo4UGy4UGG71l", // Current Ads view
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
      const body = JSON.stringify(`rail_ads&#40;{ records: ${allRecords} }&#41;`)
      
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