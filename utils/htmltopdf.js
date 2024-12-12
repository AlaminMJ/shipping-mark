import puppeteer from 'puppeteer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

// Define the async function to generate PDF
async function generatePDF() {
    try {
        // Resolve the path to the EJS template
        const templatePath = path.resolve('./templates/myTemplate.ejs');
        
        // Read and render EJS template with the provided data
        const htmlContent = await ejs.renderFile(templatePath);

        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', });
        const page = await browser.newPage();

        // Set the HTML content in the browser
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate the PDF file
        await page.pdf({
            path: 'output1.pdf',
            format: 'A4',
            landscape:true,
            printBackground: true
        });

        await browser.close();
        console.log('PDF generated successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}



// Call the function
generatePDF();
