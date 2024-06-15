let currentEditingListId = null;
let currentEditingCardId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetch('/currentUser')
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        const usernameElement = document.getElementById('username');
        usernameElement.textContent = data.user.username;
      } else {
        console.error('Ошибка при получении информации о текущем пользователе');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
    });
    const theme = localStorage.getItem('theme');
    if (theme === 'night') {
      document.body.classList.add('night-mode');
      document.getElementById('checkbox').checked = true;
    }

    loadBoards();

  const urlParams = new URLSearchParams(window.location.search);
  const boardId = urlParams.get('boardId');

  if (boardId) {
    loadListsAndCards(boardId);
  } else {
    console.error('Не удалось получить ID текущей доски из URL');
  }
});
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('night-mode');
  const theme = body.classList.contains('night-mode') ? 'night' : 'day';
  localStorage.setItem('theme', theme);
}
function toggleUserMenu() {
  const userMenu = document.getElementById('userMenu');
  if (userMenu.style.display === 'block') {
    userMenu.style.display = 'none';
  } else {
    userMenu.style.display = 'block';
  }
}

function createProject() {
  const projectName = prompt('Введите имя проекта:');
  if (!projectName) {
    alert('Имя проекта не может быть пустым');
    return;
  }

  fetch('/createProject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Проект успешно создан');
      } else {
        console.error('Ошибка при создании проекта:', data.error);
        alert('Произошла ошибка при создании проекта');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function toggleCreateBoardMenu() {
  const createBoardMenu = document.getElementById("createBoardMenu");
  if (createBoardMenu.style.display === "block") {
    createBoardMenu.style.display = "none";
  } else {
    createBoardMenu.style.display = "block";
  }
}

function closeCreateBoardMenu() {
  const createBoardMenu = document.getElementById("createBoardMenu");
  createBoardMenu.style.display = "none";
}

function createBoard() {
  const boardName = document.getElementById('boardName').value;
  if (!boardName) {
    alert('Пожалуйста, введите название доски.');
    return;
  }

  fetch('/createBoard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ boardName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Доска успешно создана');
        loadBoards();
      } else {
        console.error('Ошибка при создании доски:', data.error);
        alert('Произошла ошибка при создании доски');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function createBoard() {
  const boardName = document.getElementById('boardName').value;
  if (!boardName) {
    alert('Пожалуйста, введите название доски.');
    return;
  }

  fetch('/createBoard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ boardName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Доска успешно создана');
        loadBoards();
      } else {
        console.error('Ошибка при создании доски:', data.error);
        alert('Произошла ошибка при создании доски');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function loadBoards() {
  fetch('/boards')
    .then(response => response.json())
    .then(data => {
      const boardsDropdown = document.getElementById('boardsDropdown');
      boardsDropdown.innerHTML = '';

      if (data.boards && data.boards.length > 0) {
        data.boards.forEach(board => {
          const boardItem = document.createElement('div');
          boardItem.classList.add('board-item');
          boardItem.innerHTML = `
            <span onclick="loadBoardData('${board.id}')">${board.name}</span>
            <button onclick="toggleBoardMenu(event)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                <path d="M3 9.5A1.5 1.5 0 1 1 4.5 8 1.5 1.5 0 0 1 3 9.5zm4 0A1.5 1.5 0 1 1 8.5 8 1.5 1.5 0 0 1 7 9.5zm4 0A1.5 1.5 0 1 1 12.5 8 1.5 1.5 0 0 1 11 9.5z"/>
              </svg>
            </button>
            <div class="board-menu">
              <button onclick="editBoardName('${board.id}')">Изменить название</button>
              <button onclick="deleteBoard('${board.id}')">Удалить доску</button>
              <button onclick="openAddUserModal('${board.id}')">Добавить пользователя</button>
            </div>
          `;
          boardsDropdown.appendChild(boardItem);
        });
      } else {
        const noBoardsMessage = document.createElement('p');
        noBoardsMessage.textContent = 'У вас пока нет досок.';
        boardsDropdown.appendChild(noBoardsMessage);
      }
    })
    .catch(error => {
      console.error('Ошибка при загрузке списка досок:', error);
    });
}

function toggleBoardMenu(event) {
  const menu = event.target.closest('.board-item').querySelector('.board-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function editBoardName(boardId) {
  const newName = prompt('Введите новое название доски:');
  if (!newName) {
    alert('Название не может быть пустым');
    return;
  }

  fetch(`/board/${boardId}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при изменении названия доски:', data.error);
        alert('Произошла ошибка при изменении названия доски');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function deleteBoard(boardId) {
  if (!confirm('Вы уверены, что хотите удалить эту доску?')) {
    return;
  }

  fetch(`/board/${boardId}/delete`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при удалении доски:', data.error);
        alert('Произошла ошибка при удалении доски');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function openAddUserModal(boardId) {
  document.getElementById('addUserModal').style.display = 'block';
  currentEditingBoardId = boardId;
}

function closeAddUserModal() {
  document.getElementById('addUserModal').style.display = 'none';
}

function addUserToBoard() {
  const username = document.getElementById('addUserInput').value;
  if (!username) {
    alert('Введите имя пользователя');
    return;
  }

  fetch(`/board/${currentEditingBoardId}/addUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Пользователь успешно добавлен на доску');
        closeAddUserModal();
      } else {
        console.error('Ошибка при добавлении пользователя на доску:', data.error);
        alert('Произошла ошибка при добавлении пользователя на доску');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function openEditListModal(listId) {
  currentEditingListId = listId;
  document.getElementById('editListModal').style.display = 'block';
}

function closeEditListModal() {
  document.getElementById('editListModal').style.display = 'none';
}

function saveListName() {
  const newName = document.getElementById('editListNameInput').value;
  if (!newName) {
    alert('Название не может быть пустым');
    return;
  }

  fetch(`/list/${currentEditingListId}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при редактировании списка:', data.error);
        alert('Произошла ошибка при редактировании списка');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function deleteList(listId) {
  if (!confirm('Вы уверены, что хотите удалить этот список?')) {
    return;
  }

  fetch(`/list/${listId}/delete`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при удалении списка:', data.error);
        alert('Произошла ошибка при удалении списка');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function openEditCardModal(cardId) {
  currentEditingCardId = cardId;
  document.getElementById('editCardModal').style.display = 'block';
}

function closeEditCardModal() {
  document.getElementById('editCardModal').style.display = 'none';
}


function loadBoardData(boardId) {
  fetch(`/board/${boardId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Данные доски:', data.board);
        window.location.href = `/board.html?boardId=${boardId}`;
      } else {
        console.error('Ошибка при загрузке данных доски:', data.error);
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
    });
}

function createList() {
  const listName = document.getElementById('create-list-container').textContent;
  const boardId = getBoardIdFromUrl();

  if (!listName) {
    alert('Название списка не может быть пустым');
    return;
  }

  if (!boardId) {
    alert('Выберите доску, на которой хотите создать список');
    return;
  }

  fetch(`/board/${boardId}/createList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ listName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const listsContainer = document.getElementById('lists-container');
        const newListElement = document.createElement('div');
        newListElement.classList.add('list');
        newListElement.innerHTML = `
          <div class="list-head">
            <span>${data.list.name}</span>
            <div>
              <button class="edit-button" onclick="openEditListModal(${data.list.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 3.5 10.207V11.5h1.293l7.707-7.707-1.293-1.293zM2 12.5v1h1.5l-1-1H2zm11-9-1 1 1 1 1-1-1-1z"/>
                </svg>
              </button>
              <button class="delete-button" onclick="deleteList(${data.list.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3.5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 1 0zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1v1zM4.118 4l.4 9.6a1 1 0 0 0 1 .9h4.964a1 1 0 0 0 1-.9L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="cards-container"></div>
          <button class="add-card" onclick="openAddCardForm(${data.list.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6a.5.5 0 0 1 .5-.5z"/>
            </svg>
            Добавить карточку
          </button>
        `;
        listsContainer.appendChild(newListElement);
        window.location.reload();
      } else {
        console.error('Ошибка при создании списка:', data.error);
        alert('Произошла ошибка при создании списка');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function loadListsAndCards(boardId) {
  fetch(`/board/${boardId}/lists-and-cards`)
    .then(response => response.json())
    .then(data => {
      displayListsAndCards(data);
      
    })
    .catch(error => {
      console.error('Ошибка при загрузке списков и карточек:', error);
    });
}

function displayListsAndCards(listsAndCardsData) {
  const boardContainer = document.getElementById('board-container');
  listsAndCardsData.forEach(listData => {
    const listElement = document.createElement('div');
    listElement.classList.add('list');
    listElement.innerHTML = `
      <div class="list-head">
        <span>${listData.list.name}</span>
        <div>
          <button class="edit-button" onclick="openEditListModal(${listData.list.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1-.11-.168l10-10zM11.207 2.5 3.5 10.207V11.5h1.293l7.707-7.707-1.293-1.293zM2 12.5v1h1.5l-1-1H2zm11-9-1 1 1 1 1-1-1-1z"/>
            </svg>
          </button>
          <button class="delete-button" onclick="deleteList(${listData.list.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3.5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 1 0zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1v1zM4.118 4l.4 9.6a1 1 0 0 0 1 .9h4.964a1 1 0 0 0 1-.9L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards-container');

    listData.cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.innerHTML = `
        <div class="card-head">
          <h4>${card.name}</h4>
          <div class="card-buttons">
            <button class="edit-button" onclick="openEditCardModal(${card.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1-.11-.168l10-10zM11.207 2.5 3.5 10.207V11.5h1.293l7.707-7.707-1.293-1.293zM2 12.5v1h1.5l-1-1H2zm11-9-1 1 1 1 1-1-1-1z"/>
              </svg>
            </button>
            <button class="delete-button" onclick="deleteCard(${card.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3.5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 1 0zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1v1zM4.118 4l.4 9.6a1 1 0 0 0 1 .9h4.964a1 1 0 0 0 1-.9L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </div>
        <p>${card.description}</p>
      `;

      cardsContainer.appendChild(cardElement);
    });

    const addCardButton = document.createElement('button');
    addCardButton.classList.add('add-card');
    addCardButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6a.5.5 0 0 1 .5-.5z"/>
      </svg>
      Добавить карточку
    `;

    const addCardForm = createAddCardForm(listData.list.id);

    addCardButton.addEventListener('click', () => {
      addCardForm.style.display = 'block';
    });

    listElement.appendChild(cardsContainer);
    listElement.appendChild(addCardButton);
    listElement.appendChild(addCardForm);
    boardContainer.appendChild(listElement);
  });
}

function createAddCardForm(listId) {
  const addCardForm = document.createElement('div');
  addCardForm.classList.add('add-card-form');
  addCardForm.style.display = 'none';

  const cardNameInput = document.createElement('input');
  cardNameInput.setAttribute('type', 'text');
  cardNameInput.setAttribute('placeholder', 'Название карточки');

  const cardDescriptionInput = document.createElement('textarea');
  cardDescriptionInput.setAttribute('placeholder', 'Описание карточки');

  const saveCardButton = document.createElement('button');
  saveCardButton.textContent = 'Сохранить';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Отменить';

  saveCardButton.addEventListener('click', () => {
    const cardName = cardNameInput.value;
    const cardDescription = cardDescriptionInput.value;
    const cardData = {
      listId: listId,
      name: cardName,
      description: cardDescription,
    };

    fetch('/createCard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const newCardElement = document.createElement('div');
          newCardElement.classList.add('card');
          newCardElement.innerHTML = `
            <div class="card-head">
              <h4>${data.card.name}</h4>
              <div class="card-buttons">
                <button class="edit-button" onclick="openEditCardModal(${data.card.id})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1-.11-.168l10-10zM11.207 2.5 3.5 10.207V11.5h1.293l7.707-7.707-1.293-1.293zM2 12.5v1h1.5l-1-1H2zm11-9-1 1 1 1 1-1-1-1z"/>
                  </svg>
                </button>
                <button class="delete-button" onclick="deleteCard(${data.card.id})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3.5.5v7a.5.5 0 0 1-1 0V6a.5.5 0 0 1 1 0zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1v1zM4.118 4l.4 9.6a1 1 0 0 0 1 .9h4.964a1 1 0 0 0 1-.9L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </div>
            <p>${data.card.description}</p>
          `;
          const cardsContainer = addCardForm.previousElementSibling;
          cardsContainer.appendChild(newCardElement);
          cardNameInput.value = '';
          cardDescriptionInput.value = '';
          addCardForm.style.display = 'none';
          console.log('Карточка успешно сохранена на сервере:', data.card);
        } else {
          console.error('Ошибка при сохранении карточки:', data.error);
          alert('Произошла ошибка при сохранении карточки');
        }
      })
      .catch(error => {
        console.error('Ошибка при выполнении запроса:', error);
        alert('Произошла ошибка при выполнении запроса');
      });
  });

  cancelButton.addEventListener('click', () => {
    cardNameInput.value = '';
    cardDescriptionInput.value = '';
    addCardForm.style.display = 'none';
  });

  addCardForm.appendChild(cardNameInput);
  addCardForm.appendChild(cardDescriptionInput);
  addCardForm.appendChild(saveCardButton);
  addCardForm.appendChild(cancelButton);

  return addCardForm;
}

function getBoardIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('boardId');
}

function openEditListModal(listId) {
  currentEditingListId = listId;
  document.getElementById('editListModal').style.display = 'block';
}

function closeEditListModal() {
  document.getElementById('editListModal').style.display = 'none';
}

function saveListName() {
  const newName = document.getElementById('editListNameInput').value;
  if (!newName) {
    alert('Название не может быть пустым');
    return;
  }

  fetch(`/board/${currentEditingListId}/editList`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при редактировании списка:', data.error);
        alert('Произошла ошибка при редактировании списка');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function deleteList(listId) {
  if (!confirm('Вы уверены, что хотите удалить этот список?')) {
    return;
  }

  fetch(`/board/${listId}/deleteList`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при удалении списка:', data.error);
        alert('Произошла ошибка при удалении списка');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function openEditCardModal(cardId) {
  currentEditingCardId = cardId;
  document.getElementById('editCardModal').style.display = 'block';
}

function closeEditCardModal() {
  document.getElementById('editCardModal').style.display = 'none';
}

function saveCardDetails() {
  const newName = document.getElementById('editCardNameInput').value;
  const newDescription = document.getElementById('editCardDescriptionInput').value;

  fetch(`/card/${currentEditingCardId}/editCard`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, description: newDescription }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при редактировании карточки:', data.error);
        alert('Произошла ошибка при редактировании карточки');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}

function deleteCard(cardId) {
  if (!confirm('Вы уверены, что хотите удалить эту карточку?')) {
    return;
  }

  fetch(`/card/${cardId}/deleteCard`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();
      } else {
        console.error('Ошибка при удалении карточки:', data.error);
        alert('Произошла ошибка при удалении карточки');
      }
    })
    .catch(error => {
      console.error('Ошибка при выполнении запроса:', error);
      alert('Произошла ошибка при выполнении запроса');
    });
}
function toggleDarkMode() {
    const body = document.body;
    const darkModeEnabled = body.classList.toggle('dark-mode');

    // Сохраняем состояние в локальное хранилище
    localStorage.setItem('darkMode', darkModeEnabled);
}

