// Submit the form when the user clicks the submit button
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (addForm.checkValidity()) {
    try {
      const name = document.getElementById('name').value;
      const age = document.getElementById('age').value;
      // Send a POST request to the API endpoint
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, age })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Redirect to the home page after submitting the form
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  } else {
    addForm.classList.add('was-validated');
  }
});
