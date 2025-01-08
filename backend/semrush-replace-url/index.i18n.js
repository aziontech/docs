import { parse } from 'csv-parse'
import fs from 'fs'
import { createReadStream } from 'fs'
import path from 'path'

let counterFoundLinks = 0
let PATH = {
	csv: './www.azion.com_permanent_redirects_20241225.csv',
	i18n: `${process.env.OLDPWD}/src/i18n`
}
const wwwazioncom = 'https://www.azion.com'

async function loadRedirects() {
	const redirects = []
	const parser = createReadStream(PATH.csv).pipe(
		parse({
			columns: true,
			skip_empty_lines: true,
		})
	)

	for await (const record of parser) {
		redirects.push({
			page: record.page,
			initialUrl: record.initial_url,
			destinationUrl: record.destination_url,
			statusCode: record.status,
			discovered: record.discovered
		})
	}

	return redirects
}

async function processFile(filePath, redirects) {
	fs.readFile(filePath, async (err, content) => {
		if(err) {
			console.error(err)
			return
		}

		const utf8Content = Buffer.from(content).toString('utf-8')

		for (const item of redirects) {
			const url30x = item.initialUrl === wwwazioncom ? wwwazioncom : item.initialUrl.replace(wwwazioncom, '')
			const url200 = item.destinationUrl.replace(wwwazioncom, '')
			const isRoot = url30x === wwwazioncom
			const rgx = new RegExp(`${url30x}`, 'g')
			const contentMatch = utf8Content.match(rgx)

			if(!contentMatch) {
				// console.log(`NOT MATCH `, `${rgx} : ${url30x}`)
				continue
			} else {
				console.log(`MATCH`, `${rgx} : ${url30x}`)
			}
			counterFoundLinks++

			console.log(`{
			isRoot: ${isRoot},
			file: ${filePath},
			rgx: ${rgx},
			url30x: ${url30x},
			url200: ${url200},
			contentMatch: ${contentMatch},
			contentMatchCount: ${contentMatch.length},
			processedCount: ${counterFoundLinks}
			}`)

			const newContent = utf8Content.replace(isRoot ? /'https\:\/\/www\.azion\.com\/'/ : rgx, `'${url200}'`)
			await fs.writeFile(filePath, newContent, async (err) => {
				if(err) throw err
				console.log(`[OK] ${filePath} updated`)
			})
		}
	})
}

function processDirectory(directory, redirects) {
	fs.readdir(directory, { withFileTypes: true }, (err, entries) => {
		if (err) {
			console.error('[ERROR] directory can not be readed:', err)
			return
		}

		for (const entry of entries) {
			const fullPath = path.join(directory, entry.name)

			if(entry.isDirectory()) {
				processDirectory(fullPath, redirects)
			} else if (entry.isFile()) {
				processFile(fullPath, redirects)
			} else {
				console.error(`[ERROR] ${fullPath} is not a file or directory`)
			}
		}
	})
}

async function main() {
	try {
		const redirects = await loadRedirects()
		processDirectory(PATH.i18n, redirects)
	} catch (error) {
		console.error('[ERROR] ', error)
		process.exit(1)
	}
}

main()
