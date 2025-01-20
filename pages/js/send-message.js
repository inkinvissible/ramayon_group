function sendToWhatsapp(e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const checkIn = document.querySelector(
    'input[type="date"][name="dateIn"]'
  ).value;
  const checkOut = document.querySelector(
    'input[type="date"][name="dateOut"]'
  ).value;
  const subject = document.getElementById("subject").value;
  const message = document.querySelector('textarea[name="message"]').value;

  // Format message for WhatsApp
  const text = `Hola, quiero hacer una consulta.%0A
*Nueva Consulta desde la web*%0A
Nombre: ${name}%0A
Email: ${email}%0A
Fecha entrada: ${checkIn}%0A
Fecha salida: ${checkOut}%0A
Asunto: ${subject}%0A
Mensaje: ${message}`;

  // Replace with your phone number
  const phoneNumber = "5491155091292"; 

  // Create WhatsApp API URL
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;

  // Redirect to WhatsApp
  window.open(whatsappUrl, "_blank");
}
