function sendToWhatsApp(event) {
    event.preventDefault(); // Previene el comportamiento estándar del formulario
  
    // Referencias a los elementos del formulario
    const loadingMessage = document.querySelector('.loading');
    const sentMessage = document.querySelector('.sent-message');
    const errorMessage = document.querySelector('.error-message');
    const messageInput = document.getElementById('whatsapp-message');
  
    // Limpia mensajes previos
    loadingMessage.style.display = 'none';
    sentMessage.style.display = 'none';
    errorMessage.style.display = 'none';
  
    // Mostrar "Loading..."
    loadingMessage.style.display = 'block';
  
    // Simulación de envío (puedes eliminar el setTimeout en producción)
    setTimeout(() => {
      loadingMessage.style.display = 'none'; // Oculta "Loading..."
  
      if (messageInput.value.trim() === '') {
        // Si no hay mensaje, muestra el error
        errorMessage.style.display = 'block';
      } else {
        // Construye la URL de WhatsApp
        const phoneNumber = "54911550912923"; // Reemplaza con tu número
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageInput.value)}`;
  
        // Redirige al usuario a WhatsApp
        window.open(whatsappURL, '_blank');
  
        // Muestra el mensaje de éxito
        sentMessage.style.display = 'block';
      }
    }, 1500); // Simula un tiempo de carga de 1.5 segundos
  }
  