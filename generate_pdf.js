const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const scriptContent = fs.readFileSync(path.join(__dirname, 'assets/js/script.js'), 'utf8');

function extractArray(name) {
    const startStr = `const ${name} = [`;
    const startIndex = scriptContent.indexOf(startStr);
    if (startIndex === -1) return [];
    const endIndex = scriptContent.indexOf('];', startIndex);
    const code = scriptContent.substring(startIndex + startStr.length - 1, endIndex + 1);
    return eval(code);
}

const initiateMissions = extractArray('initiateMissions');
const operativeMissions = extractArray('operativeMissions');
const omegaMissions = extractArray('omegaMissions');

console.log(`Extracted Initiate: ${initiateMissions.length}, Operative: ${operativeMissions.length}, Omega: ${omegaMissions.length}`);

const answersDir = path.join(__dirname, 'Answers');
if (!fs.existsSync(answersDir)) {
    fs.mkdirSync(answersDir, { recursive: true });
}

const pdfPath = path.join(answersDir, 'Cryptography_Answers_All_Levels.pdf');
const doc = new PDFDocument({ margin: 40, size: 'A4' });
const writeStream = fs.createWriteStream(pdfPath);
doc.pipe(writeStream);

// Title Header
doc.fillColor('#002b49').fontSize(22).text('CRYPTOGRAPHY MISSION ANSWER KEY', { align: 'center', bold: true });
doc.moveDown(0.3);
doc.fillColor('#555555').fontSize(11).text('Master Decryption Reference - All Levels (Initiate, Operative, Omega)', { align: 'center' });
doc.moveDown(1);

function renderLevelSection(title, missions, colorHex) {
    doc.fillColor(colorHex).fontSize(16).text(title, { underline: true });
    doc.moveDown(0.5);

    const startX = 40;
    let startY = doc.y;
    const colWidths = [45, 130, 200, 140];
    const headers = ['ID', 'Cipher / Encrypted', 'Target Answer', 'Cipher Type'];

    // Header row
    doc.fillColor('#ffffff').rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), 20).fill(colorHex);
    doc.fillColor('#ffffff').fontSize(10);
    let currentX = startX + 5;
    headers.forEach((h, i) => {
        doc.text(h, currentX, startY + 5, { width: colWidths[i] - 10, align: i === 0 ? 'center' : 'left' });
        currentX += colWidths[i];
    });

    startY += 20;

    missions.forEach((m, idx) => {
        if (startY > 750) {
            doc.addPage();
            startY = 40;
        }

        const bg = idx % 2 === 0 ? '#f8f9fa' : '#ffffff';
        doc.fillColor(bg).rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), 18).fill();
        doc.fillColor('#222222').fontSize(9);

        let rowX = startX + 5;

        // ID
        doc.text(m.id, rowX, startY + 4, { width: colWidths[0] - 10, align: 'center' });
        rowX += colWidths[0];

        // Cipher
        let cipherText = m.cipher;
        if (cipherText.length > 28) cipherText = cipherText.substring(0, 25) + '...';
        doc.text(cipherText, rowX, startY + 4, { width: colWidths[1] - 10, align: 'left' });
        rowX += colWidths[1];

        // Solution
        doc.font('Helvetica-Bold').text(m.solution, rowX, startY + 4, { width: colWidths[2] - 10, align: 'left' }).font('Helvetica');
        rowX += colWidths[2];

        // Type
        let typeText = m.type.toUpperCase();
        if (m.type === 'shift' && m.shift) typeText += ` (+${m.shift})`;
        doc.text(typeText, rowX, startY + 4, { width: colWidths[3] - 10, align: 'left' });

        startY += 18;
    });

    doc.y = startY + 15;
    doc.moveDown(1);
}

renderLevelSection('LEVEL 1: INITIATE MISSIONS', initiateMissions, '#1b5e20');
if (doc.y > 650) doc.addPage();
renderLevelSection('LEVEL 2: OPERATIVE MISSIONS', operativeMissions, '#b71c1c');
if (doc.y > 650) doc.addPage();
renderLevelSection('LEVEL 3: OMEGA MISSIONS', omegaMissions, '#4a148c');

doc.end();

writeStream.on('finish', () => {
    console.log('Successfully generated Cryptography_Answers_All_Levels.pdf!');
});
