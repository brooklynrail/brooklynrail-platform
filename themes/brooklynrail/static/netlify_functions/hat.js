const Airtable = require('airtable')

exports.handler = function(event, context, callback) {
  
  var Airtable = require('airtable');
  var base = new Airtable({apiKey: process.env.AIRTABLE_JZ}).base('appaBcfR59hX27DNi');
  const allRecords = []
  // Ads base 
  // Hats table "tbl3j4X8XpY0yfeLT"
  base('tbl3j4X8XpY0yfeLT').select({
    // Selecting the first 3 records in All Hats:
    maxRecords: 30,
    // All Hats view
    view: "viwaiKePufXEmDouA", // Published Hats view
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
      // console.log(allRecords.length)
      const body = "rail_hats(" + JSON.stringify({ records: allRecords })+ ")";
      
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