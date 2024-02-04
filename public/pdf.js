const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');

function base64Encode(file) {
  return fs.readFileSync(file, { encoding: 'base64' });
}

function logo(filePath) {
  const base64Image = base64Encode(filePath);
  return `<img height="13" src="data:image/png;base64,${base64Image}"/>`;
}

const generatePDF = async (templateFilePath, data) => {
  // Read the EJS template file
  const template = fs.readFileSync(templateFilePath, 'utf-8');
  const styles = fs.readFileSync('public/style8.css', 'utf-8');
  const styles2 = fs.readFileSync('public/style7.css', 'utf-8');
  // await `<style> ${fs.readFileSync(`./style8.css`, "utf8")} </style> ${fs.readFileSync(`./showPDF.ejs`, "utf8")}`;
  // Compile the template with data
  const mergedContent = template + '\n<style>\n' + styles2 + styles + '\n</style>';
  const compiledTemplate = ejs.compile(mergedContent)(data);

  const base64Logo = base64Encode("public/companyLogo.png");
  const logoPlaceholder = `<img class="main-logo" src="data:image/png;base64,${base64Logo}">`;

  const Content = base64Encode("public/letterLogo.png", 'utf-8');
  const Image = `<img class="img-grid-2" src="data:image/png;base64,${Content}">`;

  const qr = base64Encode("public/qr.png");
  const qrPlaceholder = `<img  src="data:image/png;base64,${qr}" style="width: 7.6rem;  height: 7.6rem;"/>`;

  const last = base64Encode("public/rightMainLogo.png");

const lastPlaceholder=`<img src="data:image/png;base64,${last}" style="width: 150px height:74px; width:96px; margin-left:41.375rem; margin-top:-9rem;"/>`;


  let finalHTML = compiledTemplate.replace('<img src="letterLogo.png" class="img-grid-2">', Image);
  finalHTML = finalHTML.replace('<img src="companyLogo.png" class="main-logo">', logoPlaceholder);
  finalHTML = finalHTML.replace('mnop', qrPlaceholder);
  finalHTML = finalHTML.replace('ikl', lastPlaceholder);
  
  

  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();


  await page.setContent(finalHTML);

 await page.pdf({ path: 'public/output.pdf', format: 'Letter', format: "Letter",
      printBackground: true,
  });
 await browser.close();
};

module.exports = generatePDF;