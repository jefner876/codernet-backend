const socket = io('http://localhost:3000', { transports: ['websocket'] });

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const nickname = document.getElementById('nickname');

const handleNewNickname = () => {
  console.log(nickname.value);
  socket.emit('set-nickname', nickname.value);
};

const handleSubmitNewMessage = () => {
  socket.emit('room-general-message', { data: message.value });
};

socket.on('room-general-message', (messageData) => {
  handleNewMessage(messageData);
});

socket.on('users-changed', (messageData) => {
  handUserChange(messageData);
});

const handleNewMessage = (messageData) => {
  messages.appendChild(buildNewMessage(messageData));
};

const buildNewMessage = (messageData) => {
  const li = document.createElement('li');
  li.appendChild(
    document.createTextNode(
      `${messageData.text} (from ${messageData.from} at ${messageData.created})`,
    ),
  );
  return li;
};

const handUserChange = (messageData) => {
  messages.appendChild(buildNewUserMessage(messageData));
};

const buildNewUserMessage = (messageData) => {
  const li = document.createElement('li');
  li.appendChild(
    document.createTextNode(`${messageData.user} ${messageData.event}`),
  );
  return li;
};
