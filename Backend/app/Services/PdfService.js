const PDFDocument = require('pdfkit');

class PdfService {
    generateMissionOrder(trip, driver, truck, trailer) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const buffers = [];

                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(buffers);
                    resolve(pdfBuffer);
                });
                doc.on('error', reject);

                doc.fontSize(20).font('Helvetica-Bold').text('CAMTRA', 50, 50, { align: 'center' });
                doc.fontSize(10).font('Helvetica').text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, 50, 80, { align: 'right' });

                doc.moveDown(2);
                doc.fontSize(18).font('Helvetica-Bold').text(`ORDRE DE MISSION N° ${trip._id.toString().substring(0, 8).toUpperCase()}`, { align: 'center' });

                doc.moveDown(2);
                doc.fontSize(14).font('Helvetica-Bold').text('1. CONDUCTEUR', 50);
                doc.moveDown(0.5);
                doc.fontSize(12).font('Helvetica');
                doc.text(`Nom : ${driver.lastName || 'N/A'}`, 60);
                doc.text(`Prénom : ${driver.firstName || 'N/A'}`, 60);

                doc.moveDown(1.5);
                doc.fontSize(14).font('Helvetica-Bold').text('2. VÉHICULES', 50);
                doc.moveDown(0.5);
                doc.fontSize(12).font('Helvetica');
                doc.text(`Camion : ${truck.immatriculation || 'N/A'}`, 60);
                if (trailer) {
                    doc.text(`Remorque : ${trailer.immatriculation || 'N/A'}`, 60);
                } else {
                    doc.text('Remorque : Aucune', 60);
                }

                doc.moveDown(1.5);
                doc.fontSize(14).font('Helvetica-Bold').text('3. MISSION', 50);
                doc.moveDown(0.5);
                doc.fontSize(12).font('Helvetica');
                
                const startDate = new Date(trip.plannedStartDate).toLocaleDateString('fr-FR');
                const endDate = new Date(trip.plannedEndDate).toLocaleDateString('fr-FR');
                
                doc.text(`Départ : ${trip.departureSite || 'N/A'} le ${startDate}`, 60);
                doc.text(`Arrivée : ${trip.arrivalSite || 'N/A'} le ${endDate}`, 60);
                doc.text(`Kilométrage départ : ${trip.startKm || 0} km`, 60);

                doc.moveDown(3);
                const signatureY = doc.y;
                doc.fontSize(10).font('Helvetica');
                doc.text('Le Responsable', 100, signatureY);
                doc.text('Le Chauffeur', 400, signatureY);
                
                doc.moveTo(100, signatureY + 40).lineTo(250, signatureY + 40).stroke();
                doc.moveTo(400, signatureY + 40).lineTo(550, signatureY + 40).stroke();

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = PdfService;
