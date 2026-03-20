const mongoose = require('mongoose');
const Inspection = require('./models/Inspection');
const Quote = require('./models/Quote');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data to avoid duplicates
    await Inspection.deleteMany({});
    await Quote.deleteMany({});

    console.log("Emptying database...");

    // 1. Create Dummy Inspections
    const inspections = [
      {
        requestId: "REQ-982134",
        clientId: "client_01",
        clientEmail: "operations@maersk-shipping.com",
        inspectionType: "Pre-Purchase Survey",
        shipType: "Container Ship",
        port: "Singapore",
        country: "Singapore",
        dateFrom: "2026-04-01",
        dateTo: "2026-04-05",
        status: "Pending Review",
      },
      {
        requestId: "REQ-552109",
        clientId: "client_01",
        clientEmail: "operations@maersk-shipping.com",
        inspectionType: "Condition Survey",
        shipType: "Bulk Carrier",
        port: "Rotterdam",
        country: "Netherlands",
        dateFrom: "2026-03-25",
        dateTo: "2026-03-28",
        status: "Quote Sent",
        fees: 4500
      },
      {
        requestId: "REQ-112233",
        clientId: "client_02",
        clientEmail: "tech@vships.com",
        inspectionType: "Damage Survey",
        shipType: "Tanker",
        port: "Dubai",
        country: "UAE",
        dateFrom: "2026-03-20",
        dateTo: "2026-03-22",
        status: "Surveyor Assigned",
        vesselDetails: {
          name: "MV Atlantic Star",
          imo: "9123456",
          flag: "Panama",
          classSociety: "ABS"
        }
      }
    ];

    const createdInspections = await Inspection.insertMany(inspections);
    console.log(`✅ ${createdInspections.length} Inspections created.`);

    // 2. Create Dummy Quotes
    const quotes = [
      {
        id: "QT-4401",
        requestId: "REQ-552109",
        clientEmail: "operations@maersk-shipping.com",
        inspectionType: "Condition Survey",
        port: "Rotterdam",
        amount: 4500,
        status: "Pending",
        createdAt: "2026-03-15"
      },
      {
        id: "QT-1102",
        requestId: "REQ-112233",
        clientEmail: "tech@vships.com",
        inspectionType: "Damage Survey",
        port: "Dubai",
        amount: 3200,
        status: "Approved",
        createdAt: "2026-03-10"
      }
    ];

    await Quote.insertMany(quotes);
    console.log(`✅ ${quotes.length} Quotes created.`);

    console.log("\nDatabase seeding complete! 🚢");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();