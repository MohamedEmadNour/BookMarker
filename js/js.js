// Retrieve data from local storage on page load
const storedData = localStorage.getItem('websites');
let websites = storedData ? JSON.parse(storedData) : [];

// Function to render the table
function renderTable() {
  const tableBody = document.querySelector('#websiteTable tbody');
  tableBody.innerHTML = '';

  websites.forEach((website, index) => {
    const { name, url, addedDate } = website;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${name}</td>
      <td>${addedDate}</td>
      <td>
        <a href="${url}" class="btn btn-success" target="_blank">
          <i class="bi bi-eye" ></i> Visit
        </a>
      </td>
      <td>
        <a href="#" class="delete-btn btn btn-success" data-index="${index}">
          <i class="bi bi-trash" ></i> Delete
        </a>
      </td>
      <td>
        <a href="#" class="update-btn btn btn-success" data-index="${index}">
          <i class="bi bi-pencil" ></i> Update
        </a>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Function to handle update button click
function handleUpdate(event) {
  event.preventDefault();

  const index = event.target.dataset.index;

  const website = websites[index];

  const siteNameInput = document.querySelector('#siteName');
  const siteUrlInput = document.querySelector('#siteUrl');
  const submitButton = document.querySelector('#submitButton');

  // Set form inputs to the values of the selected website
  siteNameInput.value = website.name;
  siteUrlInput.value = website.url;

  // Change submit button text to "Edit"
  submitButton.innerText = 'Edit';
  submitButton.dataset.index = index;
}

// Function to handle form submission or update
function handleSubmit(event) {
  event.preventDefault();

  const siteNameInput = document.querySelector('#siteName');
  const siteUrlInput = document.querySelector('#siteUrl');
  const submitButton = document.querySelector('#submitButton');

  const name = siteNameInput.value;
  const url = siteUrlInput.value;
  const addedDate = new Date().toLocaleDateString();

  // Check if form inputs are empty
  if (name === '' || url === '') {
    return;
  }

  const index = submitButton.dataset.index;

  // Check if an index is provided (update operation)
  if (index) {
    websites[index] = { name, url, addedDate };
    submitButton.innerText = 'Submit';
    submitButton.dataset.index = '';
  } else {
    // Create a new website object
    const website = { name, url, addedDate };

    // Add the website to the array
    websites.push(website);
  }

  // Save the data to local storage
  localStorage.setItem('websites', JSON.stringify(websites));

  // Clear form inputs
  siteNameInput.value = '';
  siteUrlInput.value = '';

  // Render the table
  renderTable();
}

// Function to handle delete button click
function handleDelete(event) {
  event.preventDefault();

  const index = event.target.dataset.index;

  // Remove the website from the array
  websites.splice(index, 1);

  // Save the data to local storage
  localStorage.setItem('websites', JSON.stringify(websites));

  // Render the table
  renderTable();
}

// Function to show/hide the search input with animation
function toggleSearchInput() {
  const searchInput = document.querySelector('#searchInput');
  const searchIcon = document.querySelector('#searchIcon');

  if (searchInput.style.display === 'none') {
    searchInput.style.display = 'block';
    searchInput.classList.add('animate-fade-in'); // Apply the fadeIn animation
    searchIcon.classList.remove('btn-secondary');
    searchIcon.classList.add('btn-primary');
  } else {
    searchInput.classList.add('animate-fade-out'); // Apply the fadeOut animation
    searchIcon.classList.remove('btn-primary');
    searchIcon.classList.add('btn-secondary');
    setTimeout(() => {
      searchInput.style.display = 'none';
      searchInput.classList.remove('animate-fade-out');
    }, 500);
  }
}

// Function to filter the table rows based on search value
function filterTable(searchValue) {
  const tableRows = Array.from(document.querySelectorAll('#websiteTable tbody tr'));

  tableRows.forEach(row => {
    const websiteName = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
    const websiteAddedDate = row.querySelector('td:nth-child(3)').innerText.toLowerCase();

    if (websiteName.includes(searchValue.toLowerCase()) || websiteAddedDate.includes(searchValue.toLowerCase())) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Function to handle search input
function handleSearch(event) {
  const searchValue = event.target.value;
  filterTable(searchValue);
}

// Attach event listeners
const websiteForm = document.querySelector('#websiteForm');
websiteForm.addEventListener('submit', handleSubmit);

const websiteTable = document.querySelector('#websiteTable');
websiteTable.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    handleDelete(event);
  } else if (event.target.classList.contains('update-btn')) {
    handleUpdate(event);
  }
});

const searchIcon = document.querySelector('#searchIcon');
searchIcon.addEventListener('click', toggleSearchInput);

const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', handleSearch);

// Render the initial table on page load
renderTable();
