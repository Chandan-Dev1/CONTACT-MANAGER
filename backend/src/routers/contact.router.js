import express from 'express'
const ContactRouter = express.Router()
import {createContact,getContact,deleteContact,updateContact} from '../controllers/contact.controller.js'
import {createContactValidator,updateContactValidator} from '../validator/contact.validator.js'

ContactRouter.post("/create",createContactValidator,createContact)
ContactRouter.get("/get",getContact)
ContactRouter.delete("/delete/:id",deleteContact)
ContactRouter.patch("/update/:id",updateContactValidator,updateContact)


export default ContactRouter