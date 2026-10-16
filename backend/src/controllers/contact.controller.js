import ContactModel from "../models/contact.model.js";

export async function createContact(req, res) {
    try {
        const { name, email, phone, company } = req.body;

        const isContactAlreadyExist = await ContactModel.findOne({
            $or: [
                { name },
                { email }
            ]
        });

        if (isContactAlreadyExist) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const contact = await ContactModel.create({
            name,
            email,
            phone,
            company
        });

        return res.status(201).json({
            message: "Contact created successfully",
            contact
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to create contact"
        });
    }
}



export async function getContact(req, res) {
  try {

    const { q } = req.query;

    let contact;

    // If search query exists
    if (q) {

      contact = await ContactModel.find({
        $or: [
          {
            name: {
              $regex: q,
              $options: "i"
            }
          },
          {
            email: {
              $regex: q,
              $options: "i"
            }
          },
          {
            phone: {
              $regex: q,
              $options: "i"
            }
          }
        ]
      });

    } else {

      // If no search query, get all contacts
      contact = await ContactModel.find();

    }

    return res.status(200).json({
      message: "Contact data fetched successfully",
      contact
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch contacts"
    });
  }
}
export async function deleteContact(req, res) {
  try {
    const id = req.params.id;

    const contact = await ContactModel.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      message: "Contact deleted successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to delete contact",
    });
  }
}
export async function updateContact(req, res) {
  try {
    const id = req.params.id;

    const { name, email, phone, company } = req.body;

    const contact = await ContactModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        company
      },
      {
        new: true
      }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    return res.status(200).json({
      message: "Contact updated successfully",
      contact
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update contact"
    });
  }
}