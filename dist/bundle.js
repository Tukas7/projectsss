/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/board.js":
/*!**********************!*\
  !*** ./src/board.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createBoard: () => (/* binding */ createBoard),\n/* harmony export */   loadBoardData: () => (/* binding */ loadBoardData),\n/* harmony export */   loadBoards: () => (/* binding */ loadBoards)\n/* harmony export */ });\nfunction loadBoards() {\n  fetch('/boards').then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    var boardsDropdown = document.getElementById('boardsDropdown');\n    boardsDropdown.innerHTML = '';\n    if (data.boards && data.boards.length > 0) {\n      data.boards.forEach(function (board) {\n        var boardItem = document.createElement('a');\n        boardItem.textContent = board.name;\n        boardItem.href = '#';\n        boardItem.addEventListener('click', function () {\n          var boardId = board.id;\n          loadBoardData(boardId);\n        });\n        boardsDropdown.appendChild(boardItem);\n      });\n    } else {\n      var noBoardsMessage = document.createElement('p');\n      noBoardsMessage.textContent = 'У вас пока нет досок.';\n      boardsDropdown.appendChild(noBoardsMessage);\n    }\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при загрузке списка досок:', error);\n  });\n}\nfunction createBoard() {\n  var boardName = document.getElementById('boardName').value;\n  if (!boardName) {\n    alert('Пожалуйста, введите название доски.');\n    return;\n  }\n  fetch('/createBoard', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n      boardName: boardName\n    })\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.success) {\n      alert('Доска успешно создана');\n      loadBoards(); // Обновляем список досок после создания новой\n    } else {\n      console.error('Ошибка при создании доски:', data.error);\n      alert('Произошла ошибка при создании доски');\n    }\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при выполнении запроса:', error);\n    alert('Произошла ошибка при выполнении запроса');\n  });\n}\nfunction loadBoardData(boardId) {\n  fetch(\"/board/\".concat(boardId)).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.success) {\n      console.log('Данные доски:', data.board);\n      window.location.href = \"/board.html?boardId=\".concat(boardId);\n    } else {\n      console.error('Ошибка при загрузке данных доски:', data.error);\n    }\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при выполнении запроса:', error);\n  });\n}\n\n//# sourceURL=webpack://task-master-hub/./src/board.js?");

/***/ }),

/***/ "./src/card.js":
/*!*********************!*\
  !*** ./src/card.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   displayListsAndCards: () => (/* binding */ displayListsAndCards)\n/* harmony export */ });\nfunction displayListsAndCards(listsAndCardsData) {\n  var boardContainer = document.getElementById('board-container');\n  listsAndCardsData.forEach(function (listData) {\n    var listElement = document.createElement('div');\n    listElement.classList.add('list');\n    listElement.innerHTML = \"<h3>\".concat(listData.list.name, \"</h3>\");\n    var cardsContainer = document.createElement('div');\n    cardsContainer.classList.add('cards-container');\n    listData.cards.forEach(function (card) {\n      var cardElement = document.createElement('div');\n      cardElement.classList.add('card');\n      cardElement.innerHTML = \"\\n                <h4>\".concat(card.name, \"</h4>\\n                <p>\").concat(card.description, \"</p>\\n            \");\n      cardsContainer.appendChild(cardElement);\n    });\n    var addCardButton = document.createElement('button');\n    addCardButton.classList.add('add-card');\n    addCardButton.textContent = 'Добавить карточку+';\n    var addCardForm = createAddCardForm(listData.list.id);\n    addCardButton.addEventListener('click', function () {\n      addCardForm.style.display = 'block';\n    });\n    listElement.appendChild(cardsContainer);\n    listElement.appendChild(addCardButton);\n    listElement.appendChild(addCardForm);\n    boardContainer.appendChild(listElement);\n  });\n}\nfunction createAddCardForm(listId) {\n  var addCardForm = document.createElement('div');\n  addCardForm.classList.add('add-card-form');\n  addCardForm.style.display = 'none';\n  var cardNameInput = document.createElement('input');\n  cardNameInput.setAttribute('type', 'text');\n  cardNameInput.setAttribute('placeholder', 'Название карточки');\n  var cardDescriptionInput = document.createElement('textarea');\n  cardDescriptionInput.setAttribute('placeholder', 'Описание карточки');\n  var saveCardButton = document.createElement('button');\n  saveCardButton.textContent = 'Сохранить';\n  var cancelButton = document.createElement('button');\n  cancelButton.textContent = 'Отменить';\n  saveCardButton.addEventListener('click', function () {\n    var cardName = cardNameInput.value;\n    var cardDescription = cardDescriptionInput.value;\n    var cardData = {\n      listId: listId,\n      name: cardName,\n      description: cardDescription\n    };\n    fetch('/createCard', {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify(cardData)\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      if (data.success) {\n        location.reload();\n        console.log('Карточка успешно сохранена на сервере:', data.card);\n      } else {\n        console.error('Ошибка при сохранении карточки:', data.error);\n        alert('Произошла ошибка при сохранении карточки');\n      }\n    })[\"catch\"](function (error) {\n      console.error('Ошибка при выполнении запроса:', error);\n      alert('Произошла ошибка при выполнении запроса');\n    });\n    cardNameInput.value = '';\n    cardDescriptionInput.value = '';\n    addCardForm.style.display = 'none';\n  });\n  cancelButton.addEventListener('click', function () {\n    cardNameInput.value = '';\n    cardDescriptionInput.value = '';\n    addCardForm.style.display = 'none';\n  });\n  addCardForm.appendChild(cardNameInput);\n  addCardForm.appendChild(cardDescriptionInput);\n  addCardForm.appendChild(saveCardButton);\n  addCardForm.appendChild(cancelButton);\n  return addCardForm;\n}\n\n//# sourceURL=webpack://task-master-hub/./src/card.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.js */ \"./src/user.js\");\n/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board.js */ \"./src/board.js\");\n/* harmony import */ var _project_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./project.js */ \"./src/project.js\");\n/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./list.js */ \"./src/list.js\");\n/* harmony import */ var _card_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./card.js */ \"./src/card.js\");\n\n\n\n\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  (0,_user_js__WEBPACK_IMPORTED_MODULE_0__.initUserMenu)();\n  (0,_board_js__WEBPACK_IMPORTED_MODULE_1__.loadBoards)();\n  (0,_card_js__WEBPACK_IMPORTED_MODULE_4__.displayListsAndCards)(data);\n  document.getElementById('createBoardButton').addEventListener('click', _board_js__WEBPACK_IMPORTED_MODULE_1__.createBoard);\n  document.getElementById('createProjectButton').addEventListener('click', _project_js__WEBPACK_IMPORTED_MODULE_2__.createProject);\n  document.getElementById('createListButton').addEventListener('click', _list_js__WEBPACK_IMPORTED_MODULE_3__.createList);\n  var urlParams = new URLSearchParams(window.location.search);\n  var boardId = urlParams.get('boardId');\n  if (boardId) {\n    (0,_list_js__WEBPACK_IMPORTED_MODULE_3__.loadListsAndCards)(boardId);\n  } else {\n    console.error('Не удалось получить ID текущей доски из URL');\n  }\n});\n\n//# sourceURL=webpack://task-master-hub/./src/index.js?");

/***/ }),

/***/ "./src/list.js":
/*!*********************!*\
  !*** ./src/list.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createList: () => (/* binding */ createList),\n/* harmony export */   loadListsAndCards: () => (/* binding */ loadListsAndCards)\n/* harmony export */ });\nfunction createList() {\n  var listName = prompt('Введите название списка:');\n  var boardId = getBoardIdFromUrl();\n  if (!listName) {\n    alert('Название списка не может быть пустым');\n    return;\n  }\n  if (!boardId) {\n    alert('Выберите доску, на которой хотите создать список');\n    return;\n  }\n  fetch(\"/board/\".concat(boardId, \"/createList\"), {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n      listName: listName\n    })\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.success) {\n      var listsContainer = document.getElementById('lists-container');\n      var newListElement = document.createElement('div');\n      newListElement.classList.add('list');\n      newListElement.innerHTML = \"\\n                <h3 class=\\\"list-head\\\">\".concat(data.list.name, \"</h3>\\n                <!-- \\u0417\\u0434\\u0435\\u0441\\u044C \\u043C\\u043E\\u0436\\u043D\\u043E \\u0434\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u043A\\u043D\\u043E\\u043F\\u043A\\u0443 \\u0434\\u043B\\u044F \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F \\u043A\\u0430\\u0440\\u0442\\u043E\\u0447\\u0435\\u043A -->\\n            \");\n      listsContainer.appendChild(newListElement);\n    } else {\n      console.error('Ошибка при создании списка:', data.error);\n      alert('Произошла ошибка при создании списка');\n    }\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при выполнении запроса:', error);\n    alert('Произошла ошибка при выполнении запроса');\n  });\n}\nfunction loadListsAndCards(boardId) {\n  fetch(\"/board/\".concat(boardId, \"/lists-and-cards\")).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    displayListsAndCards(data);\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при загрузке списков и карточек:', error);\n  });\n}\nfunction getBoardIdFromUrl() {\n  var urlParams = new URLSearchParams(window.location.search);\n  return urlParams.get('boardId');\n}\n\n//# sourceURL=webpack://task-master-hub/./src/list.js?");

/***/ }),

/***/ "./src/project.js":
/*!************************!*\
  !*** ./src/project.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createProject: () => (/* binding */ createProject)\n/* harmony export */ });\nfunction createProject() {\n  var projectName = prompt('Введите имя проекта:');\n  if (!projectName) {\n    alert('Имя проекта не может быть пустым');\n    return;\n  }\n  fetch('/createProject', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n      projectName: projectName\n    })\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.success) {\n      alert('Проект успешно создан');\n      // Обновите список проектов здесь, если необходимо\n    } else {\n      console.error('Ошибка при создании проекта:', data.error);\n      alert('Произошла ошибка при создании проекта');\n    }\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при выполнении запроса:', error);\n    alert('Произошла ошибка при выполнении запроса');\n  });\n}\n\n//# sourceURL=webpack://task-master-hub/./src/project.js?");

/***/ }),

/***/ "./src/user.js":
/*!*********************!*\
  !*** ./src/user.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initUserMenu: () => (/* binding */ initUserMenu),\n/* harmony export */   toggleUserMenu: () => (/* binding */ toggleUserMenu)\n/* harmony export */ });\nfunction initUserMenu() {\n  fetch('/currentUser').then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.user) {\n      var usernameElement = document.getElementById('username');\n      usernameElement.textContent = data.user.username;\n    } else {\n      console.error('Ошибка при получении информации о текущем пользователе');\n    }\n  })[\"catch\"](function (error) {\n    console.error('Ошибка при выполнении запроса:', error);\n  });\n}\nfunction toggleUserMenu() {\n  var userMenu = document.getElementById('userMenu');\n  if (userMenu.style.display === 'block') {\n    userMenu.style.display = 'none';\n  } else {\n    userMenu.style.display = 'block';\n  }\n}\n\n//# sourceURL=webpack://task-master-hub/./src/user.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;