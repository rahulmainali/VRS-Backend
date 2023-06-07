const Booking = require("../../../models/booking.model");
const Vehicle = require("../../../models/vehicle.model");
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import moment from "moment";

const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const mailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const pdf = require("html-pdf");
const puppeteer = require("puppeteer");

async function generatePdfAndSendEmail(html: string, email: string, ownerEmail: string) {
  // Create a new Puppeteer browser instance
  const browser = await puppeteer.launch();

  // Create a new page in the browser
  const page = await browser.newPage();

  // Set the page content to the provided HTML
  await page.setContent(html);

  // Generate the PDF buffer from the page
  const pdfBuffer = await page.pdf({ format: "A4" });

  // Close the browser
  await browser.close();

  // Create a transporter for sending email
  const transporter = mailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Send the email with the PDF attachment
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Invoice",
    html: "<p>Please find attached the invoice.</p>",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
      },
    ],
  };
  await transporter.sendMail(mailOptions);

  // Send the email with the PDF attachment
  const newMailOptions = {
    from: process.env.EMAIL,
    to: ownerEmail,
    subject: "Invoice",
    html: "<p>Please find attached the invoice.</p>",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
      },
    ],
  };
  await transporter.sendMail(newMailOptions);
}

const CREATE_BOOKING = async (req: Request, res: Response) => {
  const {
    ownerId,
    ownerName,
    startDate,
    endDate,
    vehicleId,
    userId,
    vehiclePrice,
    amount,
    vehicleName,
    vehicleNumber,
    vehicleModel,
    userName,
    userEmail,
    ownerEmail,
  } = req.body;

  try {
    // Check if the vehicle is available during the booking period
    const vehicle = await Vehicle.findById(vehicleId);

    // if vehicle is available that means it has not been booked till now

    if (!vehicle.available) {
      // check for booking conflicts

      const bookings = await Booking.find({ vehicleId: vehicleId });
      const conflict = bookings.some((booking: any) => {
        const start = booking.startDate;
        const end = booking.endDate;
        return (
          (moment(startDate).isSameOrAfter(start) &&
            moment(startDate).isBefore(end)) ||
          (moment(endDate).isSameOrBefore(end) &&
            moment(endDate).isAfter(start))
        );
      });

      if (conflict) {
        return res
          .status(400)
          .json({ message: "Booking conflicts with existing bookings" });
      }
    }

    // Create a new booking
    const booking = new Booking({
      userName,
      ownerId,
      vehicleName,
      vehicleModel,
      vehicleNumber,
      vehiclePrice,
      startDate,
      endDate,
      ownerName,
      status: "completed",
      amount: parseInt(amount),
      vehicleId: new mongoose.Types.ObjectId(vehicleId),
      userId: new mongoose.Types.ObjectId(userId),
      createdOn: new Date().toString(),
    });


    // Save the booking to the database
    await booking.save();

    // Update the availability status of the vehicle
    vehicle.available = false;
    await vehicle.save();

    // Render the ejs template and pass the user data to it
    
    const user = { name: userName, email: userEmail };
    const owner = { name: ownerName, email: ownerEmail };
    const vehicleInfo = {
      name: vehicleName,
      model: vehicleModel,
      number: vehicleNumber,
      price: vehiclePrice,
      startDate: startDate,
      endDate: endDate,
      amount: amount,
    };
    const ejsHtml = await ejs.renderFile(__dirname + "/bill.ejs", {
      user,owner , vehicleInfo
    });
    // Call the function with the user data and the rendered HTML content
    await generatePdfAndSendEmail(ejsHtml, userEmail, ownerEmail);

    return res.status(201).json({
      message: "Booking created successfully.",
      bookingDetail: booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = CREATE_BOOKING;
