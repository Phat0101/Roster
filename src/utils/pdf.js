import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export function generatePDF() {
  return new Promise((resolve, reject) => {
    const input = document.getElementById('rosterTable');
    toPng(input)
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = function () {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(img);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save("roster.pdf");
          resolve();
        };
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
        reject(error);
      });
  });
}