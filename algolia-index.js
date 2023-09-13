const fs = require('fs');
const args = require('node:process');
const algoliasearch = require("algoliasearch");
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
			if(!stats.isFile()) {
					console.log(`[!] ${filepath} it is not a file or not exist.`);
					return;
			}
			
			if(!index) {
					throw '[!] An Algolia Index should be configured.';
			}
			
			let chunkLength = 0;
			let chunkList = [];
			let stream = fs.createReadStream(filepath).pipe(StreamArray.withParser());
			
			index.clearObjects().then(() => {
					stream.on('data', ({value}) => {
							chunkLength++;
							chunkList.push(value);
							
							if(chunkList.length === 10000) {
									stream.pause();
									
									index.saveObjects(chunkList, {
										autoGenerateObjectIDIfNotExist: true
									}).then(() => {
											chunkList = [];
											stream.resume();
									}).catch(function(error) {
											throw error;
									});
							}
					}).on('end', () => {
							if (!chunkList.length) {
									return;
							}
							
							index.saveObjects(chunkList, {
								autoGenerateObjectIDIfNotExist: true
							}).then(() => {
									chunkList = [];
							}).catch(function(error) {
									throw error;
							});
					}).on('error', (err) => {
							throw err;
					});
			}).catch(function(error) {
					throw error;
			});
	});
}


//////////////////
// CONFIGURATION //
//////////////////


const config = {
	key: {
		app:  getArgAppId(),
		api: getArgApi()
	},
	filepath: {
		en: './en/doc-all-data.json', // moved to the root during github actions pipeline
		ptbr: './pt-br/doc-all-data.json' // moved to the root during github actions pipeline
	}
}

try {
	if(!config.key.app || !config.key.api) {
		console.log('config.key.app', config.key.app);
		console.log('config.key.api', config.key.api);

		throw '[!] config.appid or config.api are invalid params';
	}

	let client = algoliasearch(config.key.app, config.key.api);
	uploadBatches(client.initIndex('azion-doc-en'), config.filepath.en);
	uploadBatches(client.initIndex('azion-doc-ptbr'), config.filepath.ptbr);
} catch(err) {
	console.log(err);
}
