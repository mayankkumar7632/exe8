const API_URL = "http://localhost:5000/api/contacts";

const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

const contactList = document.getElementById("contactList");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

let editingContactId = null;


// ========================================
// LOAD CONTACTS
// ========================================

async function loadContacts() {

    try {

        const response = await fetch(API_URL);

        const contacts = await response.json();

        displayContacts(contacts);

    } catch (error) {

        console.error("Error loading contacts:", error);

        contactList.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


// ========================================
// DISPLAY CONTACTS
// ========================================

function displayContacts(contacts) {

    contactList.innerHTML = "";

    if (contacts.length === 0) {

        contactList.innerHTML =
            '<p class="no-contacts">No contacts found.</p>';

        return;
    }

    contacts.forEach(contact => {

        const contactCard = document.createElement("div");

        contactCard.className = "contact-card";

        contactCard.innerHTML = `

            <h3>${contact.name}</h3>

            <p>
                <strong>Email:</strong>
                ${contact.email}
            </p>

            <p>
                <strong>Phone:</strong>
                ${contact.phone}
            </p>

            <p>
                <strong>Address:</strong>
                ${contact.address || "Not provided"}
            </p>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editContact('${contact._id}')"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteContact('${contact._id}')"
                >
                    Delete
                </button>

            </div>
        `;

        contactList.appendChild(contactCard);
    });
}


// ========================================
// ADD / UPDATE CONTACT
// ========================================

contactForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const contactData = {

        name: nameInput.value,

        email: emailInput.value,

        phone: phoneInput.value,

        address: addressInput.value
    };


    try {

        let response;


        // UPDATE
        if (editingContactId) {

            response = await fetch(
                `${API_URL}/${editingContactId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(contactData)
                }
            );

        }

        // ADD
        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(contactData)
                }
            );
        }


        if (!response.ok) {

            throw new Error("Operation failed");
        }


        const result = await response.json();

        console.log(result);


        // Reset form
        resetForm();

        // Reload contacts
        loadContacts();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }

});


// ========================================
// EDIT CONTACT
// ========================================

async function editContact(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);

        const contact =
            await response.json();


        nameInput.value = contact.name;

        emailInput.value = contact.email;

        phoneInput.value = contact.phone;

        addressInput.value = contact.address;


        editingContactId = id;


        formTitle.textContent = "Edit Contact";

        submitButton.textContent = "Update Contact";

        cancelButton.style.display = "block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert("Unable to load contact.");
    }
}


// ========================================
// DELETE CONTACT
// ========================================

async function deleteContact(id) {

    const confirmation =
        confirm("Are you sure you want to delete this contact?");


    if (!confirmation) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });


        if (!response.ok) {

            throw new Error("Delete failed");
        }


        loadContacts();

    } catch (error) {

        console.error(error);

        alert("Unable to delete contact.");
    }
}


// ========================================
// CANCEL EDIT
// ========================================

function cancelEdit() {

    resetForm();
}


// ========================================
// RESET FORM
// ========================================

function resetForm() {

    contactForm.reset();

    editingContactId = null;

    formTitle.textContent = "Add Contact";

    submitButton.textContent = "Add Contact";

    cancelButton.style.display = "none";
}


// ========================================
// INITIAL LOAD
// ========================================

loadContacts();