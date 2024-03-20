let modal = document.getElementById("modal");
let addBtn = document.getElementById("addBtn");
let closeBtn = document.getElementsByClassName("close")[0];
let saveBtn = document.getElementById("saveBtn");
let dataForm = document.getElementById("dataForm");
let dataTable = document.getElementById("dataTable");
let tableBody = document.getElementById("tableBody");
let modalTitle = document.getElementById("modalTitle");
let nimInput = document.getElementById("nim");
let namaInput = document.getElementById("nama");
let alamatInput = document.getElementById("alamat");
let editMode = false;
let editIndex = null;
let editNIM = null; // tambahkan variabel untuk menyimpan NIM saat mode edit

// Event listener for input event on NIM input field
nimInput.addEventListener("input", function (event) {
  // Get the current value of the input field
  let currentValue = event.target.value;
  // Use regular expression to test if the value contains only numbers
  let isValid = /^\d*$/.test(currentValue);
  // If the input value is not a number, remove the invalid characters
  if (!isValid) {
    event.target.value = currentValue.replace(/\D/g, "");
  }
});

addBtn.onclick = function () {
  modal.style.display = "block";
  modalTitle.innerText = "Add Data";
  editMode = false;
  dataForm.reset();
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

dataForm.onsubmit = function (event) {
  event.preventDefault();
  let nim = nimInput.value;
  let nama = namaInput.value;
  let alamat = alamatInput.value;
  if (editMode) {
    updateData(editIndex, nama, alamat);
  } else {
    if (nim && nama && alamat) {
      addData(nim, nama, alamat);
      showAlert("Berhasil Menambahkan Data Baru");
      modal.style.display = "none";
    } else {
      showAlert("Data tidak lengkap. Tidak dapat menambah data.");
    }
  }
};

function addData(nim, nama, alamat) {
  let newRow = tableBody.insertRow();
  newRow.innerHTML = `
  <td>${nim}</td>
  <td>${nama}</td>
  <td>${alamat}</td>
  <td>
    <button class="editBtn">Edit
      <i class="fas fa-edit"></i>
    </button>
    <button class="deleteBtn">Delete
      <i class="fas fa-trash"></i>
    </button>
  </td>
`;
  newRow.querySelector(".editBtn").addEventListener("click", function () {
    editIndex = newRow.rowIndex;
    modal.style.display = "block";
    modalTitle.innerText = "Edit Data";
    editMode = true;
    editNIM = nim; // simpan nilai NIM saat mode edit
    nimInput.value = nim;
    namaInput.value = nama;
    alamatInput.value = alamat;
  });
  newRow.querySelector(".deleteBtn").addEventListener("click", function () {
    dataTable.deleteRow(newRow.rowIndex);
    showAlert("Berhasil Menghapus Data");
  });

  let totalRows = tableBody.getElementsByTagName("tr").length;
  let newRowsCount = totalRows - (currentPage - 1) * rowsPerPage;

  // Check if the number of new rows exceeds 6, then move to the next page
  if (newRowsCount > 5) {
    displayRows();
    updatePagination();
  }
}

function updateData(index, nama, alamat) {
  let row = dataTable.rows[index];
  row.cells[1].innerText = nama;
  row.cells[2].innerText = alamat;
  // Periksa apakah NIM berbeda, jika berbeda, ubah juga nilai NIM di dalam tabel
  if (nimInput.value !== editNIM) {
    row.cells[0].innerText = nimInput.value;
  }
  showAlert("Berhasil Melakukan Update Data");
  modal.style.display = "none";
}

// Define the alert modal and close button
let alertModal = document.getElementById("alertModal");
let alertCloseBtn = document.querySelector("#alertModal .close");

// Function to display the alert modal
function showAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  alertModal.style.display = "block";

  // Set timeout to hide the alert after 3 seconds
  setTimeout(function () {
    alertModal.style.display = "none";
  }, 3000);
}
let currentPage = 1;
const rowsPerPage = 5;

// Function to display rows based on current page
function displayRows() {
  let rows = tableBody.getElementsByTagName("tr");
  let startIndex = (currentPage - 1) * rowsPerPage;
  let endIndex = startIndex + rowsPerPage;

  for (let i = 0; i < rows.length; i++) {
    if (i >= startIndex && i < endIndex) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

// Function to update pagination controls
function updatePagination() {
  let totalPages = Math.ceil(
    tableBody.getElementsByTagName("tr").length / rowsPerPage
  );
  let prevPageBtn = document.getElementById("prevPageBtn");
  let nextPageBtn = document.getElementById("nextPageBtn");

  if (currentPage === 1) {
    prevPageBtn.disabled = true;
  } else {
    prevPageBtn.disabled = false;
  }

  if (currentPage === totalPages) {
    nextPageBtn.disabled = true;
  } else {
    nextPageBtn.disabled = false;
  }
}

// Event listener for previous page button
document.getElementById("prevPageBtn").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    displayRows();
    updatePagination();
  }
});

// Event listener for next page button
document.getElementById("nextPageBtn").addEventListener("click", function () {
  let totalPages = Math.ceil(
    tableBody.getElementsByTagName("tr").length / rowsPerPage
  );
  if (currentPage < totalPages) {
    currentPage++;
    displayRows();
    updatePagination();
  }
});

// Call initial display and pagination update
displayRows();
updatePagination();