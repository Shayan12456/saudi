exports.generate_pdf_with_css = async (req, res) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const logo_url = "companyLogo.png";
  
    // FETCHING LOGO FROM URL AND CONVERTING INTO BASE64
    var logo = await fetch(logo_url)
      .then((response) => response.buffer())
      .then((buffer) => buffer.toString("base64"))
      .catch(console.error);
  
    //  ADDING CSS TO HTML BODY CONTENT
    const html = await `<style> ${fs.readFileSync(`./style7.css`, "utf8")} </style> ${fs.readFileSync(`./showPDF.ejs`, "utf8")}`;
    await page.setContent(html, { waitUntil: "domcontentloaded"});
  
    const pdf = await page.pdf({
      format: "A4",
      printBackground: false,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
  
      headerTemplate: `<div class="header"><img decoding="async" width="100" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%200'%3E%3C/svg%3E" alt="company_logo" data-lazy-src="data:image/png;base64, ${logo}"><noscript><img decoding="async" width="100" src="data:image/png;base64, ${logo}" alt="company_logo"></noscript></div> `,
      footerTemplate: '<footer><h5>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h5></footer>',
      margin: { top: "200px", bottom: "150px", right: "20px", left: "20px" },
    });
  
    //  SENDING BACK PDF IN RESPONCE TO API CALL
    res.contentType("application/pdf");
    res.send(pdf);
  };