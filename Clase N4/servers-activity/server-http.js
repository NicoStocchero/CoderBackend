import express from 'express';
import fs from 'fs';

const server = express();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.get('/welcome', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Bienvenido</title>
            </head>
            <body>
                <h1>¡Bienvenido a mi servidor Express!</h1>
                <p>Esta es la página de bienvenida.</p>
            </body>
        </html>
    `);
});


// 127.0.0.1:3000/users?gender=mal
server.get('/users', (req, res) => {
    const query = req.query;
    const { gender } = query;
    const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
    if (gender) {
        if (gender === 'male') {
            const maleUsers = users.filter(user => user.gender === 'male');
            res.json({ status: 'success', data: maleUsers });
        } else if (gender === 'female') {
            const femaleUsers = users.filter(user => user.gender === 'female');
            res.json({ status: 'success', data: femaleUsers });
        } else {
            res.json({ status: 'success', data: users });
        }
    } else {
        res.json({ status: 'success', data: users });
    }
});

server.get('/users/:id', (req, res) => {
    const params = req.params;
    const id = parseInt(params.id);
    const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
    const user = users.find(user => user.id === id);
    if (user) {
        res.json({ status: 'success', data: user });
    } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
    }
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});

