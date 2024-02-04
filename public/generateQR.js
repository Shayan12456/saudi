const QRCode = require('qrcode');

let qrGen = (protocol, subdomains, query, path, port, hostname, size)=>{
  let queryString = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&');
  const subdomainsString = subdomains.length == 0 ? '' : subdomains.join('.');
  let data = {
    url: `${protocol}://${subdomainsString}.${hostname}:${port}${path}?${queryString}`
  }
  const options = {
    width: size, // Set the width of the QR code
  };
  stJSON = JSON.stringify(data.url);
  stJSON = stJSON.replace('"', "");
  stJSON = stJSON.replace('"', "");

  QRCode.toFile("public/qr.png", stJSON, options, function (err){
  if(err) return console.log(err);
  // console.log("qr generated, congrats!");
});
}

module.exports = qrGen; 