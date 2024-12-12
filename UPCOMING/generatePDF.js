import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
const Customers=[
  "AB AGRIGENTO SOMAX",
  "AB SCIACCA SOMAX",
  "BUCALO C.SICILIA CT",
  "BUCALO ETNAPOLIS CT",
  "BUCALO LA TORRE PA",
  "BUCALO LE MASSERIE RG",
  "BUCALO LE ZAGARE CT",
  "BUCALO LIBERTA'PA",
  "BUCALO MAQUEDA PA",
  "BUCALO MESSINA",
  "BUCALO PORTE DI CT",
  "BUCALO STRASBURGO PA",
  "BUCALO TRAPANI",
  // "LA MALFA 14 PA",
  "THE B #2 VILLESSE GO",
  "THE B DA VINCI PA",
  "THE B SCIUTI PA",
  "TREMESTIERI",
  "AB ACIREALE A&N",
  "AB BAGHERIA SAPIA",
  "AB COMISO A&G",
  "AB PATERNÒ A&N",
  "REGGIO CALABRIA",
];

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
     let page = 1
    // Loop through data and render the body EJS template for each item
    for (let j = 0; j < Customers.length; j++) {  
      for (let i = 0; i < data.length; i++) {
        // Render the HTML content for each data item
        const htmlContent = await ejs.renderFile(bodyTemplatePath, {
          item: { data: data[i], customer: Customers[j] }
        });
        // Accumulate the HTML content for the entire document
        allHtmlContent += htmlContent;

        // Add page break after specified items
        // if (i < data.length - 1) {
        //   allHtmlContent += '<div class="page-break"></div>';
        // }
        // if (page % 2 ===0) {
        //   allHtmlContent += '<div class="page-break"></div>';
        // }
        // else{
        //   allHtmlContent+='<div style="margin:40px 0; border-top:0.2px dashed gray"></div>'
        // }
        allHtmlContent += '<div class="page-break"></div>';
        page++
        
      }
    }
    allHtmlContent += tailContent;   
    // console.log(allHtmlContent) 
    return allHtmlContent;

  } catch (error) {
    throw error;
  }
};


// Define the async function to generate a multi-page PDF
export async function generatePDF(data, fileName,outfile) {
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
      waitUntil: "networkidle2",
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
    const outputPath = path.resolve(`./pdf/${outfile?outfile:fileName}_${timestamp}.pdf`);

    // Generate the PDF file with multiple pages
    await page.pdf({
      path: outputPath,
      format: "A4",
      landscape: true,
      printBackground: true,
      scale: 0.95,
      margin: {
        top: "20mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    await browser.close();
    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    await browser.close();
  }
}

const generateHTML2 = async (data, fileName) => {
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
     let page = 1
    // Loop through data and render the body EJS template for each item
    for (let j = 0; j < Customers.length; j++) {  
      for (let i = 0; i < data.length; i++) {
        // Render the HTML content for each data item
        const htmlContent = await ejs.renderFile(bodyTemplatePath, {
          item: { data: data[i], customer: Customers[j] }
        });
        // Accumulate the HTML content for the entire document
        allHtmlContent += htmlContent;

        // Add page break after specified items
        // if (i < data.length - 1) {
        //   allHtmlContent += '<div class="page-break"></div>';
        // }
        if (page % 2 ===0) {
          allHtmlContent += '<div class="page-break"></div>';
        }
        else{
          allHtmlContent+='<div style="margin:40px 0; border-top:0.2px dashed gray"></div>'
        }
        // allHtmlContent += '<div class="page-break"></div>';
        page++
        
      }
    }
    allHtmlContent += tailContent;   
    // console.log(allHtmlContent) 
    return allHtmlContent;

  } catch (error) {
    throw error;
  }
};
// Define the async function to generate a multi-page PDF
export async function generatePDF2(data, fileName,outfile) {
  try {
    const allHtmlContent = await generateHTML2(data, fileName);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const page = await browser.newPage();

    // Set the HTML content in the browser
    await page.setContent(allHtmlContent, {
      waitUntil: "networkidle2",
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
    const outputPath = path.resolve(`./pdf/${outfile?outfile:fileName}_${timestamp}.pdf`);

    // Generate the PDF file with multiple pages
    await page.pdf({
      path: outputPath,
      format: "A4",
      landscape: true,
      printBackground: true,
      scale: 0.95,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    await browser.close();
    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    await browser.close();
  }
}



const generateHTML3 = async (data, fileName) => {
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
     let page = 1
    // Loop through data and render the body EJS template for each item
    for (let j = 0; j < Customers.length; j++) {  
      for (let i = 0; i < data.length; i++) {
        // Render the HTML content for each data item
        const htmlContent = await ejs.renderFile(bodyTemplatePath, {
          item: { data: data[i], customer: Customers[j] }
        });
        // Accumulate the HTML content for the entire document
        allHtmlContent += htmlContent;

        // Add page break after specified items
        // if (i < data.length - 1) {
        //   allHtmlContent += '<div class="page-break"></div>';
        // }
        allHtmlContent += '<div class="page-break"></div>';
        
      }
    }
    allHtmlContent += tailContent;   
    // console.log(allHtmlContent) 
    return allHtmlContent;

  } catch (error) {
    throw error;
  }
};
// Define the async function to generate a multi-page PDF
export async function generatePDF3(data, fileName,outfile) {
  try {
    const allHtmlContent = await generateHTML3(data, fileName);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const page = await browser.newPage();

    // Set the HTML content in the browser
    await page.setContent(allHtmlContent, {
      waitUntil: "networkidle2",
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
    const outputPath = path.resolve(`./pdf/${outfile?outfile:fileName}_${timestamp}.pdf`);

    // Generate the PDF file with multiple pages
    await page.pdf({
      path: outputPath,
      format: "A4",
      landscape: true,
      printBackground: true,
      scale: 0.95,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    await browser.close();
    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    await browser.close();
  }
}


