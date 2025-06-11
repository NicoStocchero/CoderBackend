import express from 'express';

const server = express();

let frase = 'Hola Mundo';

server.use(express.json());

server.get('/api/frase', (req, res) => {
    res.json({ status: 'success', data: { frase } });
});

server.get('/api/frase/:pid', (req, res) => {
    const pid = req.params.pid;
    const palabras = frase.split(' ');

    if (isNaN(pid) || pid < 0 || pid >= palabras.length) {
        return res.status(400).json({ status: 'error', message: 'Posición inválida' });
    } else {
        res.json({ status: 'success', data: palabras[pid] });
    }
});

server.post('/api/frase', (req, res) => {
    const { palabra } = req.body;
    const palabras = frase.split(' ');
    palabras.push(palabra);
    frase = palabras.join(' ');
    res.json({ status: 'success', data: { frase }, pos: palabras.length - 1 });
});

server.put('/api/palabras/:pos', (req, res) => {
    const pos = req.params.pos;
    const { palabra } = req.body;
    const palabras = frase.split(' ');

    if (isNaN(pos) || pos < 0 || pos >= palabras.length) {
        return res.status(400).json({ status: 'error', message: 'Posición inválida' });
    } else {
        palabras[pos] = palabra;
        frase = palabras.join(' ');
        res.json({ status: 'success', data: { frase } });
    }
});

server.delete('/api/palabras/:pos', (req, res) => {
    const pos = parseInt(req.params.pos);
    const palabras = frase.split(' ');

    if (isNaN(pos) || pos < 0 || pos >= palabras.length) {
        return res.status(400).json({ status: 'error', message: 'Posición inválida' });
    } else {
        palabras.splice(pos, 1);
        frase = palabras.join(' ');
        res.json({ status: 'success', data: { frase } });
    }
});

server.listen(5000, '0.0.0.0', () => {
    console.log('Server is running on port 5000');
});