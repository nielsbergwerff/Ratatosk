MD js-server\models
COPY NUL js-server\models\users.js

CALL npm install express
CALL npm install socket.io
CALL npm install body-parser
CALL npm install helmet
CALL npm install mysql
CALL npm install sequelize-auto
CALL npm install bcrypt
CALL npm install cookie-session
