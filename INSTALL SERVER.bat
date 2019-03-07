MD js-server\models
COPY NUL js-server\models\users.js

CALL npm i express
CALL npm i socket.io
CALL npm i body-parser
CALL npm i helmet
CALL npm i mysql
CALL npm i sequelize-auto
CALL npm i cookie-session
CALL npm i morgan
