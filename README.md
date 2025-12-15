# Contacts REST API

A simple REST API for managing contacts, built with Node.js and Express.

## Features

- **Persistence**: Contacts are stored in a PostgreSQL database using Sequelize.
- **List Contacts**: Retrieve all stored contacts.
- **Get Contact**: Retrieve a specific contact by ID.
- **Add Contact**: Create a new contact with validation.
- **Remove Contact**: Delete a contact by ID.
- **Update Contact**: Update an existing contact's details.
- **Update Status**: Update the "favorite" status of a contact.
- **Data Seeding**: Automatically populates the database with initial data from `db/contacts.json` if empty.

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd goit-node-rest-api
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
```

## Usage

### Development Mode

Run the server with nodemon (auto-restart on changes):

```bash
npm run dev
```

### Production Mode

Run the server normally:

```bash
npm run start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### GET /api/contacts

Returns a list of all contacts.

**Response (200):**

```json
[
  {
    "id": "ae52d273-34c9-426c-8f9f-67726b742887",
    "name": "Allen Raymond",
    "email": "nulla.ante@vestibul.co.uk",
    "phone": "(992) 914-3792"
  }
]
```

### GET /api/contacts/:id

Returns a contact by ID.

**Response (200):**

```json
{
  "id": "ae52d273-34c9-426c-8f9f-67726b742887",
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792"
}
```

**Error (404):** `{"message": "Not found"}`

### POST /api/contacts

Adds a new contact.

**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-555-5555"
}
```

_All fields are required._

**Response (201):**

```json
{
  "id": "random-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-555-5555"
}
```

**Error (400):** Input validation error.

### DELETE /api/contacts/:id

Deletes a contact by ID.

**Response (200):**

```json
{
  "id": "ae52d273-34c9-426c-8f9f-67726b742887",
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792"
}
```

**Error (404):** `{"message": "Not found"}`

### PUT /api/contacts/:id

Updates a contact. At least one field is required in the body.

**Body (JSON):**

```json
{
  "name": "Jane Doe"
}
```

**Response (200):** Returns the updated contact object.
**Error (400):** Body missing fields or validation error.
**Error (404):** `{"message": "Not found"}`

### PATCH /api/contacts/:id/favorite

Updates the favorite status of a contact.

**Body (JSON):**

```json
{
  "favorite": true
}
```

**Response (200):** Returns the updated contact object.
**Error (400):** Missing field `favorite`.
**Error (404):** `{"message": "Not found"}`

## Technologies

- Node.js
- Express
- Joi (Validation)
- Cors
- Morgan (Logger)
