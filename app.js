const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const Airtable = require('airtable');
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now());
  res.set('x-powered-by', 'cyclic.sh');
  console.log(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`,
  );
  next();
});
// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'css', 'js', 'ico', 'jpg', 'jpeg', 'png', 'svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false,
};
app.use(express.static('public', options));

app.get('/api/historic-spots', async (req, res) => {
  const base = new Airtable().base('appVpIuJPpgBhA886');
  const historicSpots = [];
  base('Historic Spots Map')
    .select({
      // Selecting the first 3 records in Grid view:
      view: 'Grid view',
    })
    .eachPage(
      async (records, fetchNextPage) => {
        historicSpots.push(...records.map((record) => record._rawJson));
        console.log({ historicSpots });
        fetchNextPage();
      },
      () => {
        res.send(historicSpots);
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      },
    );
});



module.exports = app;
