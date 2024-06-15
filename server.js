const express = require('express');
const sql = require('mssql/msnodesqlv8');
const bodyParser = require('body-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;

const config = {
  database: 'Projects',
  server: 'DESKTOP-P5P1QBE\\TUKAS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  }
};

sql.connect(config, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключение к базе данных успешно');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Обслуживание статических файлов из папки "public"
app.use(express.static(__dirname));

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Маршрут для отображения страницы входа
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const request = new sql.Request();

  const sqlQuery = `SELECT * FROM Users WHERE username = '${username}' AND passwordHash = '${password}'`;

  request.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении SQL-запроса:', error);
      res.status(500).send('Ошибка сервера');
      return;
    }

    if (results.recordset.length > 0) {
      // Вход успешен, устанавливаем сессию
      const user = results.recordset[0];
      req.session.user = user.username;
      req.session.userId = user.ID; // Устанавливаем id пользователя в сессии
      res.redirect('/dashboard'); // Редирект на страницу после входа
    } else {
      res.status(401).send('Неверные учетные данные');
    }
  });
});


// Маршрут для обработки запроса регистрации
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Простая валидация данных
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все поля.' });
  }

  // Проверка формата имени пользователя (допускаются только буквы, цифры и подчеркивания)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: 'Имя пользователя может содержать только буквы, цифры и подчеркивания.' });
  }

  // Проверка формата адреса электронной почты
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Пожалуйста, введите правильный адрес электронной почты.' });
  }

  try {
    // Проверка уникальности имени пользователя
    const usernameCheckQuery = `SELECT * FROM Users WHERE username = '${username}'`;
    const usernameCheckResult = await sql.query(usernameCheckQuery);

    if (usernameCheckResult.recordset.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким именем уже зарегистрирован.' });
    }

    // Проверка уникальности адреса электронной почты
    const emailCheckQuery = `SELECT * FROM Users WHERE email = '${email}'`;
    const emailCheckResult = await sql.query(emailCheckQuery);

    if (emailCheckResult.recordset.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким адресом электронной почты уже зарегистрирован.' });
    }
    ; // Добавьте эту строку
    // Если и имя пользователя, и адрес электронной почты уникальны, добавляем пользователя в базу данных
    const insertQuery = `INSERT INTO Users (username, passwordHash, email) VALUES ('${username}', '${password}', '${email}')`;
    await sql.query(insertQuery);

    return res.redirect('/login');
  } catch (error) {
    console.error('Ошибка при выполнении SQL-запроса:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});




app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});


app.get('/currentUser', (req, res) => {
  if (req.session.user) {
    const request = new sql.Request();
    const sqlQuery = `SELECT * FROM Users WHERE username = '${req.session.user}'`;

    request.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Ошибка при выполнении SQL-запроса:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
      } else {
        if (results.recordset.length > 0) {
          res.json({ user: results.recordset[0] });
        } else {
          res.status(404).json({ error: 'Пользователь не найден' });
        }
      }
    });
  } else {
    res.status(401).json({ error: 'Пользователь не авторизован' });
  }
});

app.post('/createBoard', (req, res) => {
  const { boardName } = req.body;
  

  if (!boardName) {
    return res.status(400).json({ error: 'Название доски не может быть пустым' });
  }
  
  const insertQuery = `INSERT INTO Boards (name, owner_id) VALUES ('${boardName}', ${req.session.userId})`;
  
  sql.query(insertQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при создании доски:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      // Данные успешно вставлены, отправляем ответ с успехом
      return res.status(200).json({ success: true, message: 'Доска успешно создана' });
    } else {
      return res.status(500).json({ error: 'Не удалось создать доску' });
    };

    
  });
});

app.get('/boards', (req, res) => {
  
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }
  
  const query = `SELECT * FROM Boards WHERE owner_id = ${req.session.userId}`;
  
  sql.query(query, (error, result) => {
    if (error) {
      console.error('Ошибка при получении списка досок:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    const boards = result.recordset; // Получаем список досок из результата запроса
    res.json({ boards }); // Отправляем список досок в формате JSON
  });
});

app.get('/board/:boardId', (req, res) => {
  const boardId = req.params.boardId;


  const sqlQuery = `SELECT * FROM Boards WHERE ID = ${boardId}`;
  sql.query(sqlQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при выполнении SQL-запроса:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      if (result.recordset.length > 0) {
        const board = result.recordset[0];
        res.json({ success: true, board });
      } else {
        res.status(404).json({ error: 'Доска не найдена' });
      }
    }
  });
});

// Маршрут для создания нового списка
app.post('/board/:boardId/createList', (req, res) => {
  const boardId = req.params.boardId;
  const { listName } = req.body;

  if (!listName) {
    return res.status(400).json({ error: 'Название списка не может быть пустым' });
  }

  const request = new sql.Request();
  const sqlQuery = `INSERT INTO Lists (BoardID, ListName) VALUES (${boardId}, '${listName}')`;

  request.query(sqlQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при создании списка:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      // Список успешно создан, отправляем ответ с информацией о созданном списке
      const newList = { id: result.insertId, name: listName };
      res.status(201).json({ success: true, list: newList });
    } else {
      return res.status(500).json({ error: 'Не удалось создать список' });
    }
  });
});

// Маршрут для получения списков на доске
app.get('/board/:boardId/lists', (req, res) => {
  const boardId = req.params.boardId;
  const request = new sql.Request();
  const sqlQuery = `SELECT * FROM Lists WHERE BoardID = ${boardId}`;

  request.query(sqlQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при получении списков:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    const lists = result.recordset;
    res.status(200).json({ lists });
  });
});



// Маршрут для получения всех списков и карточек на доске
app.get('/board/:boardId/lists-and-cards', (req, res) => {
  const boardId = req.params.boardId;
  const request = new sql.Request();

  // Запрос для получения всех списков и их карточек для данной доски
  const sqlQuery = `
    SELECT Lists.*, Cards.*
    FROM Lists
    LEFT JOIN Cards ON ListID = CardsListID
    WHERE BoardID = ${boardId}
  `;

  request.query(sqlQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при получении списков и карточек:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    const listsAndCards = {};

    // Обработка результатов запроса и формирование структуры данных
    result.recordset.forEach((row) => {
      const listId = row.ListID;

      if (!listsAndCards[listId]) {
        listsAndCards[listId] = {
          list: {
            id: listId,
            name: row.ListName,
          },
          cards: [],
        };
      }

      if (row.CardID) {
        listsAndCards[listId].cards.push({
          id: row.CardID,
          name: row.CardName,
          description: row.CardDescription,
        });
      }
    });
    
    // Преобразуем объект в массив для отправки
    const resultArray = Object.values(listsAndCards);

    res.status(200).json(resultArray);
  });
});

app.post('/createCard', (req, res) => {
  const { listId, name, description } = req.body;

  if (!listId || !name) {
    return res.status(400).json({ error: 'Недостаточно данных для создания карточки' });
  }

  const request = new sql.Request();
  const sqlQuery = `
    INSERT INTO Cards (CardsListID, CardName, CardDescription)
    VALUES (${listId}, '${name}', '${description || ''}')
  `;
  console.log(sqlQuery);

  request.query(sqlQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при создании карточки:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      // Карточка успешно создана, отправляем ответ с информацией о созданной карточке
      const newCard = { id: result.insertId, name, description };
      res.status(201).json({ success: true, card: newCard });
    } else {
      return res.status(500).json({ error: 'Не удалось создать карточку' });
    }
  });
});



app.put('/board/:listId/editList', (req, res) => {
  const listId = req.params.listId;
  const { name } = req.body;

  const updateQuery = `UPDATE Lists SET ListName = '${name}' WHERE ListID = ${listId}`;

  sql.query(updateQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при редактировании списка:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.status(200).json({ success: true });
  });
});

// Маршрут для удаления списка
app.delete('/board/:listId/deleteList', (req, res) => {
  const listId = req.params.listId;

  const deleteQuery = `DELETE FROM Lists WHERE ListID = ${listId}`;

  sql.query(deleteQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при удалении списка:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.status(200).json({ success: true });
  });
});

// Маршрут для редактирования карточки
app.put('/card/:cardId/editCard', (req, res) => {
  const cardId = req.params.cardId;
  const { name, description } = req.body;

  const updateQuery = `UPDATE Cards SET CardName = '${name}', CardDescription = '${description}' WHERE CardID = ${cardId}`;

  sql.query(updateQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при редактировании карточки:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.status(200).json({ success: true });
  });
});

// Маршрут для удаления карточки
app.delete('/card/:cardId/deleteCard', (req, res) => {
  const cardId = req.params.cardId;

  const deleteQuery = `DELETE FROM Cards WHERE CardID = ${cardId}`;

  sql.query(deleteQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при удалении карточки:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.status(200).json({ success: true });
  });
});

app.put('/board/:boardId/edit', (req, res) => {
  const boardId = req.params.boardId;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Название доски не может быть пустым' });
  }

  const updateQuery = `UPDATE Boards SET name = '${name}' WHERE id = ${boardId}`;

  sql.query(updateQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при обновлении доски:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      return res.status(200).json({ success: true, message: 'Название доски обновлено' });
    } else {
      return res.status(500).json({ error: 'Не удалось обновить название доски' });
    }
  });
});

app.delete('/board/:boardId/delete', (req, res) => {
  const boardId = req.params.boardId;

  const deleteCardsQuery = `DELETE FROM Cards WHERE CardsListID IN (SELECT ListID FROM Lists WHERE BoardID = ${boardId})`;
  const deleteListsQuery = `DELETE FROM Lists WHERE BoardID = ${boardId}`;
  const deleteBoardMembersQuery = `DELETE FROM BoardMembers WHERE board_id = ${boardId}`;
  const deleteBoardQuery = `DELETE FROM Boards WHERE id = ${boardId}`;

  // Удаление карточек
  sql.query(deleteCardsQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при удалении карточек:', error);
      return res.status(500).json({ error: 'Ошибка при удалении карточек' });
    }

    // Удаление списков
    sql.query(deleteListsQuery, (error, result) => {
      if (error) {
        console.error('Ошибка при удалении списков:', error);
        return res.status(500).json({ error: 'Ошибка при удалении списков' });
      }

      // Удаление участников доски
      sql.query(deleteBoardMembersQuery, (error, result) => {
        if (error) {
          console.error('Ошибка при удалении участников доски:', error);
          return res.status(500).json({ error: 'Ошибка при удалении участников доски' });
        }

        // Удаление доски
        sql.query(deleteBoardQuery, (error, result) => {
          if (error) {
            console.error('Ошибка при удалении доски:', error);
            return res.status(500).json({ error: 'Ошибка при удалении доски' });
          }

          if (result.rowsAffected && result.rowsAffected[0] > 0) {
            return res.status(200).json({ success: true, message: 'Доска удалена' });
          } else {
            return res.status(500).json({ error: 'Не удалось удалить доску' });
          }
        });
      });
    });
  });
});

app.post('/board/:boardId/addUser', (req, res) => {
  const boardId = req.params.boardId;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Имя пользователя не может быть пустым' });
  }

  const selectUserQuery = `SELECT ID FROM Users WHERE username = '${username}'`;

  sql.query(selectUserQuery, (error, result) => {
    if (error) {
      console.error('Ошибка при поиске пользователя:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (result.recordset.length > 0) {
      const userId = result.recordset[0].ID;
      const insertBoardMemberQuery = `INSERT INTO BoardMembers (board_id, user_id) VALUES (${boardId}, ${userId})`;

      sql.query(insertBoardMemberQuery, (error, result) => {
        if (error) {
          console.error('Ошибка при добавлении пользователя на доску:', error);
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
          return res.status(200).json({ success: true, message: 'Пользователь успешно добавлен на доску' });
        } else {
          return res.status(500).json({ error: 'Не удалось добавить пользователя на доску' });
        }
      });
    } else {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
  });
});




app.post('/resetPassword', (req, res) => {
  const { email } = req.body;

  // Проверьте, существует ли пользователь с данным email
  const query = `SELECT * FROM Users WHERE email = '${email}'`;
  sql.query(query, (error, results) => {
    if (error) {
      console.error('Ошибка при выполнении SQL-запроса:', error);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (results.recordset.length === 0) {
      return res.status(404).json({ error: 'Пользователь с таким email не найден' });
    }

    // Генерация токена восстановления пароля
    const token = Math.random().toString(36).substr(2);

    // Сохранение токена в базе данных
    const updateQuery = `UPDATE Users SET resetPasswordToken = '${token}', resetPasswordExpires = DATEADD(HOUR, 1, GETDATE()) WHERE email = '${email}'`;
    sql.query(updateQuery, (error, result) => {
      if (error) {
        console.error('Ошибка при обновлении токена восстановления пароля:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      // Отправка письма с инструкциями по восстановлению пароля
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'vma23022@mail.com',
          pass: 'gsetzpicdnehbmxp'
        }
      });

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Восстановление пароля',
        text: `Для восстановления пароля перейдите по следующей ссылке: http://localhost:3000/reset/${token}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Ошибка при отправке письма:', error);
          return res.status(500).json({ error: 'Ошибка при отправке письма' });
        }

        res.json({ success: true, message: 'Письмо с инструкциями по восстановлению пароля отправлено' });
      });
    });
  });
});
