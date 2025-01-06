import { parse } from 'csv-parse'
import fs from 'fs'
import { createReadStream } from 'fs'
import path from 'path'
import matter from 'gray-matter'

let PATH = {}
PATH.csv = './www.azion.com_permanent_redirects_20241225.csv'
PATH.docs = `${process.env.OLDPWD}/src/content/docs`

let counterFoundLinks = 0

function findReplace(content, oldUrl, newUrl) {
	return content.replace(oldUrl, newUrl)
}

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
	fs.readFile(filePath, function(err, content) {
		if(err) {
			console.error(err)
			return
		}

		const { data, content: markdownContent } = matter(content)
		const utf8Content = Buffer.from(markdownContent).toString('utf-8')

		for(let i = 0; i < redirects.length; i++) {
			const item = redirects[i]
			const url3xx = item.initialUrl
			const url200 = item.destinationUrl
			const rgx = new RegExp(`(${url3xx})`, 'g')

			if(!utf8Content.match(rgx)) {
				continue
			}

			counterFoundLinks++
			const newContent = findReplace(markdownContent, url3xx, url200)
			const updatedContent = matter.stringify(data, newContent)
			
			fs.writeFile(filePath, updatedContent)
		}
	})
}

async function processDirectory(directory, redirects) {
	fs.readdir(directory, { withFileTypes: true }, async (err, entries) => {
		if (err) {
			console.error('[ERROR] directory can not be readed:', err)
			return
		}

		for (const entry of entries) {
			const fullPath = path.join(directory, entry.name)

			if(entry.isDirectory()) {
				await	processDirectory(fullPath, redirects)
			} else if (entry.isFile()) {
				await processFile(fullPath, redirects)
			} else {
				console.error(`[ERROR] ${fullPath} is not a file or directory`)
			}
		}
	})
}

async function main() {
	try {
		const redirects = await loadRedirects()
		await processDirectory(PATH.docs, redirects)
		
		console.log(`{
			totalRedirects: ${redirects.length},
			counterFoundLinks: ${counterFoundLinks}
		}`)
	} catch (error) {
		console.error('[ERROR] ', error)
		process.exit(1)
	}
}

main()
