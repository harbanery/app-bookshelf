const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const inputBookId = document.getElementById("inputBookId");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  const bookSubmitButton = document.getElementById("bookSubmit");
  const clearInputBookButton = document.getElementById("resetButton");

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBook();
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  clearInputBookButton.addEventListener("click", function () {
    inputBookForm.reset();
    document.getElementById("inputBookId").value = "";
    bookSubmitButton.innerHTML =
      "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
  });

  inputBookIsComplete.addEventListener("change", function () {
    if (!inputBookId.value) {
      const span = bookSubmitButton.querySelector("span");
      if (span) {
        span.innerText = inputBookIsComplete.checked
          ? "Selesai dibaca"
          : "Belum selesai dibaca";
      }
    }
  });

  if (isStorageExist()) {
    loadBooksFromStorage();
  }
});

function submitBook() {
  const inputBookId = document.getElementById("inputBookId").value;
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  if (inputBookId) {
    const bookIndex = books.findIndex((book) => book.id == inputBookId);
    if (bookIndex !== -1) {
      books[bookIndex].title = inputBookTitle;
      books[bookIndex].author = inputBookAuthor;
      books[bookIndex].year = parseInt(inputBookYear);
      books[bookIndex].isComplete = inputBookIsComplete;
    }
  } else {
    const bookObject = {
      id: +new Date(),
      title: inputBookTitle,
      author: inputBookAuthor,
      year: parseInt(inputBookYear),
      isComplete: inputBookIsComplete,
    };
    books.push(bookObject);
  }

  document.getElementById("inputBook").reset();
  document.getElementById("inputBookId").value = "";
  document.getElementById("bookSubmit").innerText = "Masukkan Buku ke rak";
  saveBooksToStorage();
  renderBooks(books);
}

function saveBooksToStorage() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function renderBooks(bookData) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  let hasIncompleteBooks = false;
  let hasCompleteBooks = false;

  for (let book of bookData) {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
      hasCompleteBooks = true;
    } else {
      incompleteBookshelfList.append(bookElement);
      hasIncompleteBooks = true;
    }
  }

  if (!hasIncompleteBooks) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Tidak ada buku yang belum selesai dibaca.";
    incompleteBookshelfList.append(emptyMessage);
  }

  if (!hasCompleteBooks) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Tidak ada buku yang sudah selesai dibaca.";
    completeBookshelfList.append(emptyMessage);
  }
}

function makeBookElement(book) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookYear, actionContainer);

  if (book.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai dibaca";
    undoButton.addEventListener("click", function () {
      toggleBookCompletion(book.id);
    });

    actionContainer.append(undoButton);
  } else {
    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    completeButton.innerText = "Selesai dibaca";
    completeButton.addEventListener("click", function () {
      toggleBookCompletion(book.id);
    });

    actionContainer.append(completeButton);
  }

  const editButton = document.createElement("button");
  editButton.classList.add("yellow");
  editButton.innerText = "Edit buku";
  editButton.addEventListener("click", function () {
    getBook(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  actionContainer.append(editButton, deleteButton);

  return container;
}

function searchBook() {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchBookTitle)
  );

  renderBooks(filteredBooks);
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadBooksFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
  renderBooks(books);
}

function toggleBookCompletion(bookId) {
  const bookTarget = books.find((book) => book.id === bookId);
  if (bookTarget) {
    bookTarget.isComplete = !bookTarget.isComplete;
    saveBooksToStorage();
    renderBooks(books);
  }
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooksToStorage();
  renderBooks(books);
  alert(`Buku telah dihapus!`);
}

function getBook(bookId) {
  const bookTarget = books.find((book) => book.id === bookId);
  if (bookTarget) {
    document.getElementById("inputBookId").value = bookTarget.id;
    document.getElementById("inputBookTitle").value = bookTarget.title;
    document.getElementById("inputBookAuthor").value = bookTarget.author;
    document.getElementById("inputBookYear").value = bookTarget.year;
    document.getElementById("inputBookIsComplete").checked =
      bookTarget.isComplete;

    document.getElementById(
      "bookSubmit"
    ).innerHTML = `Perbarui Buku <span>${bookTarget.title}</span>`;
  }
}
