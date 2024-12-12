import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";

let browser;
const generateHTML = async (data, fileName) => {
  try {
    // Resolve the paths to the EJS templates
    const headTemplatePath = path.resolve(`./templates/${fileName}/head.ejs`);
    const bodyTemplatePath = path.resolve(`./templates/${fileName}/body.ejs`);
    const tailTemplatePath = path.resolve(`./templates/${fileName}/tail.ejs`);

    // Render the head and tail parts once
    const headContent = await ejs.renderFile(headTemplatePath);
    const tailContent = await ejs.renderFile(tailTemplatePath);

    // Initialize an empty string to accumulate all HTML content
    let allHtmlContent = headContent;

    // Loop through data and render the body EJS template for each item
    for (let i = 0; i < data.length; i++) {
      // Render the HTML content for each data item
      // console.log(data[i]);
      const htmlContent = await ejs.renderFile(bodyTemplatePath, {
        item: data[i],
      });

      // Accumulate the HTML content for the entire document
      allHtmlContent += htmlContent;

      // Add page break after each item except the last one
      if (i < data.length - 1) {
        allHtmlContent += '<div class="page-break"></div>';
      }
    }

    allHtmlContent += tailContent;

    return allHtmlContent;
  } catch (error) {
    throw error;
  }
};

// Define the async function to generate a multi-page PDF
async function generatePDF(data, fileName, outfile = undefined) {
  try {
    const allHtmlContent = await generateHTML(data, fileName);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const page = await browser.newPage();

    // Set the HTML content in the browser
    await page.setContent(allHtmlContent, {
      waitUntil: "networkidle0",
      timeout: 300000,
    });
    // Generate a dynamic file name using timestamp
    const formatDate = (date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${dd}-${mm}-${yyyy}-${hh}-${min}-${ss}`;
    };
    const timestamp = formatDate(new Date());
    const outputPath = path.resolve(
      `./pdf/${outfile ? outfile : fileName}_${timestamp}.pdf`
    );

    // Generate the PDF file with multiple pages
    await page.pdf({
      path: outputPath,
      format: "A5",
      landscape: true,
      printBackground: true,
      // scale: 90
      margin: {
        top: "10mm",
        right: "5mm",
        bottom: "10mm",
        left: "5mm",
      },
    });

    await browser.close();
    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    await browser.close();
  }
}

export default generatePDF;
