const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Дозволяємо всім підключатись для тестів (небезпечно у продакшені!)
  },
});

// Коли клієнт підключається
io.on('connection', (socket) => {
  console.log('Новий користувач підключився:', socket.id);

  // Отримуємо повідомлення від клієнта
  socket.on('message', (data) => {
    console.log('Отримано повідомлення:', data);
    // Відправляємо всім клієнтам
    io.emit('message', data);
  });

  // Відключення
  socket.on('disconnect', () => {
    console.log('Користувач відключився:', socket.id);
  });
});

// Запускаємо сервер
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
