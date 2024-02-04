const fs = require('fs');

class FileWriter {
    /**
     *
     * @param filename
     * @param content
     */
    write(filename, content) {
        fs.writeFile(filename, content, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            }
        });
    }
}

module.exports = FileWriter;
