import fs from 'fs';

fs.promises.writeFile('output.txt', 'Hello, World!', 'utf8')
    .then(() => {
        return fs.promises.access('output.txt');
    })
    .then(() => {
        return fs.promises.readFile('output.txt', 'utf8');
    })
    .then(content => {
        console.log('File content:', content);
        return fs.promises.appendFile('output.txt', '\nAppended text.', 'utf8');
    })
    .then(() => {
        return fs.promises.readFile('output.txt', 'utf8');
    })
    .then(updatedContent => {
        console.log('Updated file content:', updatedContent);
        return fs.promises.unlink('output.txt');
    })
    .catch(err => {
        console.error('Error:', err);
    });

const asyncOperations = async () => {
    try {
        await fs.promises.writeFile('output.txt', 'Hello, World!', 'utf8');
        await fs.promises.access('output.txt');
        let content = await fs.promises.readFile('output.txt', 'utf8');
        console.log('File content:', content);
        
        await fs.promises.appendFile('output.txt', '\nAppended text.', 'utf8');
        content = await fs.promises.readFile('output.txt', 'utf8');
        console.log('Updated file content:', content);
        
        await fs.promises.unlink('output.txt');
    } catch (err) {
        console.error('Error:', err);
    }
}

asyncOperations();