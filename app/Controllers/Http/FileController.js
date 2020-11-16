'use strict'

const Drive = use('Drive')
const File = use('App/Models/File')

const mammoth = require('mammoth')
const pdf = require('pdf-parse')

class FileController {
  async index ({ auth, view }) {
    const files = await File
      .query()
      .where({ user_id: auth.user.id })
      .with('author')
      .fetch()

    return view.render('history', { files: files.toJSON() })
  }
  
  async create ({ view }) {
    return view.render('new')
  }
  
  async store ({ request, response, auth, session }) {
    const extnames = ['txt', 'doc', 'docx', 'pdf']
    
    const uploadedFile = request.file('file', {
      extnames,
      size: '2mb'
    })

    if (!uploadedFile) {
      session
          .withErrors({ file: 'Nenhum arquivo foi enviado' })
          .flashAll()

      return response.redirect('back')
    }

    if (!extnames.includes(uploadedFile.extname)) {
      session
          .withErrors({ file: 'O formato do arquivo enviado é inválido' })
          .flashAll()

      return response.redirect('back')
    }

    const buffer = await Drive.get(uploadedFile.tmpPath)
    let bufferData = ''

    switch (uploadedFile.extname) {
      case 'txt':
        const txtFile = buffer
        bufferData = txtFile.toString()
        break

      case 'doc':
        const docFile = await mammoth.extractRawText({ buffer })
        bufferData = docFile.value
        break

      case 'docx':
        const docxFile = await mammoth.extractRawText({ buffer })
        bufferData = docxFile.value
        break

      case 'pdf':
        const pdfFile = await pdf(buffer)
        bufferData = pdfFile.text
        break
    }

    if (bufferData === '') {
      session
          .withErrors({ file: 'O arquivo enviado está vazio' })
          .flashAll()

      return response.redirect('back')
    }
    
    const file = await File.create({
      name: uploadedFile.clientName,
      content: bufferData,
      user_id: auth.user.id
    })

    return response.redirect(`/detalhes/${file.id}`)
  }
  
  async show ({ params, response, auth, view }) {
    const file = await File.find(params.id)

    if (file.user_id !== auth.user.id) {
      return response.redirect('/')
    }

    const filteredContent = file.content
      .split(/[\s.:;?©\_\-,!""(\)@[\]]+/)
      .filter(el => el !== '');

    const results = new Map();

    for (let word of filteredContent) {
      word = word.toLowerCase();

      if (results.has(word)) {
        results.set(word, results.get(word) + 1);
      } else {
        results.set(word, 1);
      }
    }

    const tableData = [];

    for (const Key of results.keys()) {
      tableData.push([Key, results.get(Key)]);
    }
    
    tableData.sort((a, b) => b[1] - a[1]);

    return view.render('details', { file, filteredContent, tableData })
  }
}

module.exports = FileController
