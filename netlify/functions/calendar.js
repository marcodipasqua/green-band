const https = require('https');

exports.handler = async function(event, context) {
  const icsUrl = "https://calendar.google.com/calendar/ical/b4f8701752bf56ce316450e8cd90b66b290502f92083a81748e0bed996e481e1%40group.calendar.google.com/public/basic.ics";

  return new Promise((resolve) => {
    https.get(icsUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=180"
          },
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    });
  });
};
