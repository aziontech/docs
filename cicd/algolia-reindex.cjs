const fs = require('fs');
const args = require('node:process');
const algoliasearch = require('algoliasearch');
const StreamArray = require('stream-json/streamers/StreamArray');

function getArgAppId() {
	let result = '';

	args.argv.forEach((val) => {
		let t = val.match(/app=(.*)/gi) || [];
		if (t.length) {
			result = t[0].replace(`app=`, '') || result;
		}
	});

	return result;
}

function getArgApi() {
	let result = '';

	args.argv.forEach((val) => {
		let t = val.match(/api=(.*)/gi) || [];
		if (t.length) {
			result = t[0].replace(`api=`, '') || result;
		}
	});

	return result;
}

function uploadBatches(index, filepath) {
	fs.stat(filepath, (error, stats) => {
		if (error) {
			console.error(error);
			process.exit(1)
		};
		if (!stats.isFile) {
			console.error(`[!] ${filepath} it is not a file or not exist.`);
			process.exit(1)
		}

		let chunkLength = 0;
		let chunkList = [];
		let stream = fs.createReadStream(filepath).pipe(StreamArray.withParser());

		if (!index) {
			console.error('[!] An Algolia Index should be configured.')
			process.exit(1)
		}

		index.clearObjects().then(() => {
			stream.on('data', ({ value }) => {
				chunkLength++;
				chunkList.push(value);

				if (chunkList.length === 10000) {
					stream.pause();

					index.saveObjects(chunkList, {
						autoGenerateObjectIDIfNotExist: true
					}).then(() => {
						chunkList = [];
						stream.resume();
					}).catch(function (error) {
						console.log(error)
						process.exit(1)
					});
				}
			}).on('end', () => {
				if (!chunkList.length) {
					return;
				}

				index.saveObjects(chunkList, {
					autoGenerateObjectIDIfNotExist: true
				}).then(() => {
					console.log(`Success saveObjects:`, filepath)
					chunkList = [];
				}).catch(function (error) {
					console.log(error)
					process.exit(1)
				});
			}).on('error', (err) => {
				console.error(`Error saveObjects:`, error)
				process.exit(1)
			});
		}).catch(function (error) {
			console.error(`Error clearObjects:`, error)
			process.exit(1)
		});
	});
}


//////////////////
// CONFIGURATION //
//////////////////


const config = {
	key: {
		app: getArgAppId(),
		api: getArgApi()
	},
	filepath: {
		en: './dist/en/doc-all-data.json',
		ptbr: './dist/pt-br/doc-all-data.json'
	}
}

try {
	if (!config.key.app || !config.key.api) {
		throw '[!] config.appid or config.api are invalid params';
	}

	let client = algoliasearch(config.key.app, config.key.api);
	uploadBatches(client.initIndex('azion-doc-en'), config.filepath.en);
	uploadBatches(client.initIndex('azion-doc-ptbr'), config.filepath.ptbr);
} catch (err) {
	console.log(err);
	process.exit(1)
}
