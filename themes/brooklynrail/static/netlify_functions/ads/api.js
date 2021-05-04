const Airtable = require('airtable')

exports.handler = function(event, context, callback) {
  
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.AIRTABLE_JZ}).base('appaBcfR59hX27DNi');

  base('Web Ads').select({
    // Selecting the first 3 records in All Ads:
    maxRecords: 15,
    // view: "All Ads", // All Ads view
    view: "viwHVo4UGy4UGG71l", // Current Ads view
  }).eachPage(function page(records, fetchNextPage) {
    var all_records = shuffle(records); // shuffles all the order of records

    all_records.forEach(function(record) {
      allRecords.push(record)
    })
    fetchNextPage()
  },
  function done(err) {
    if (err) {
      callback(err)
    } else {
      console.log(allRecords.length)
      const body = JSON.stringify({ records: allRecords })
      const response = {
        statusCode: 200,
        body: body,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'Cache-Control: max-age=60, public'
        }
      }
      callback(null, response)
    }
  })
}