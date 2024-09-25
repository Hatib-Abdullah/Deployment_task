fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('data');
    data.forEach(item => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const emailCell = document.createElement('td');
      nameCell.textContent = item.name;
      emailCell.textContent = item.age;
      row.appendChild(nameCell);
      row.appendChild(emailCell);
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error('Failed to fetch data', error));
