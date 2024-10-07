const Airtable = require('airtable')

exports.handler = function(event, context, callback) {
  
  var Airtable = require('airtable');
  // Winter Campaign Data == appvW1Ad2kMh1S1T1
  // https://airtable.com/appvW1Ad2kMh1S1T1/tblvLjFcrYeoCWOiP/viw9VsRRzuRYvIrgT?blocks=hide
  var base = new Airtable({apiKey: process.env.AIRTABLE_JZ}).base('appvW1Ad2kMh1S1T1');
  const allRecords = []
  // Campaigns Table
  base('tbl9k6L9O6PrTtWDc').select({
    maxRecords: 1,
    // This ID should match the view that is named to the current year
    view: "viwKVL99hyMNGeEct",
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
      const body = JSON.stringify({ records: allRecords });
      
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