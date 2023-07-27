const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, '.');

function isDirectory(p) {
    return fs.lstatSync(p).isDirectory()
}

function readDir(dirpath) {
    fs.readdir(dirpath, function (err, itens) {
        if (err) {
            console.log('Unable to scan directory: ' + err);
            return;
        }

        itens.forEach(function (item) {
            let path = `${dirpath}/${item}`;

            if (!path.includes("src")) {
							return
						}

            if(isDirectory(path)) {
                readDir(path);
                return
            }

						if (!path.includes("includes")) {
							return
						}
						
						if (!path.includes("docs_help_center")) {
							return
						}

            const buffer = fs.readFileSync(path);
            const content = buffer.toString('utf-8');
            const text = content.replace(/{: target="_blank"}/g, '');

            fs.writeFileSync(path, text, 'utf-8');
        });
    });
}

readDir(directoryPath);
