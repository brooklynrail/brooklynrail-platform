
// const Mailgun = require('mailgun-js');
const Airtable = require('airtable')

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_JZ
})

// Example Base
const BASE = Airtable.base('appGUDrjD5Cifat4M')
const TABLE = 'Table 1'
// HQ Base
// const base = Airtable.base('appGUDrjD5Cifat4M')

// =============================================

// const sendThankYouEmail = async ({ email }) => {
//   return new Promise((resolve, reject) => {
//     console.log('Sending the email');
//     const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env;
//     const mailgun = Mailgun({
//       apiKey,
//       domain
//     });
//
//     const mailData = {
//       from: 'Stefan Judis <no-reply@stefanjudis.com>',
//       to: email,
//       subject: 'Thank you for your interest',
//       text: "I'll come back to you asap!"
//     };
//
//     mailgun.messages().send(mailData, err => {
//       if (err) return reject(err);
//
//       resolve();
//     });
//   });
// };

const saveUser = async ({ email }) => {
  return new Promise((resolve, reject) => {
    const { AT_API_KEY: AIRTABLE_JZ, BASE, TABLE } = process.env;
    //
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: process.env.AIRTABLE_JZ
    })
    //
    const base = Airtable.base(BASE);
    base(TABLE).create({ email }, err => {
      if (err) return reject(err);

      resolve();
    });

  });
};

exports.handler = async event => {
  try {
    const data = JSON.parse(event.body);

    // await sendThankYouEmail(data);
    console.log('Airtable Data');
    console.log(data);
    if (data.email) {
      await saveUser(data);
    }
    // send a thank you email
    // sign person

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Registration Done!!!"
      })
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: e.mssage
    };
  }
};
