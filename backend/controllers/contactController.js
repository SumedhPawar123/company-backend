const Contact = require("../models/Contact");

// Create Contact Message (Public)
exports.createContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      const error = new Error("All fields are required");
      error.status = 400;
      return next(error);
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Contacts (Admin)
exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Contact (Admin)
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      const error = new Error("Contact not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Contact (Admin)
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      const error = new Error("Contact not found");
      error.status = 404;
      return next(error);
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};