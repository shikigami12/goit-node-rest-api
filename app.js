import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  console.error(err); // Log the error for debugging
  res.status(status).json({ message });
});

import fs from "fs/promises";
import path from "path";
import Contact from "./db/models/Contact.js";
import sequelize from "./db/connection.js";

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    try {
      const data = await fs.readFile(path.join(process.cwd(), "db/contacts.json"), "utf8");
      const contacts = JSON.parse(data);

      for (const contact of contacts) {
        const existing = await Contact.findOne({ where: { email: contact.email } });
        if (!existing) {
          await Contact.create({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            favorite: false,
          });
          console.log(`Seeded contact: ${contact.name}`);
        }
      }
    } catch (error) {
      console.error("Seeding error:", error.message);
    }
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
