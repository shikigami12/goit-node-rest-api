import Contact from "../db/models/Contact.js";

export async function listContacts() {
  return Contact.findAll();
}

export async function getContactById(contactId) {
  return Contact.findByPk(contactId);
}

export async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export async function addContact(name, email, phone) {
  return Contact.create({ name, email, phone });
}

export async function updateContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  return contact.update(data);
}

export async function updateStatusContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  return contact.update(data);
}
