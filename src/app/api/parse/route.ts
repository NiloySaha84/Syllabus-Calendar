import { NextRequest, NextResponse } from 'next/server'
import PDFParse from 'pdf-parse'
import { parseSyllabusText } from '@/lib/parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    let text = ''

    if (file.type === 'application/pdf') {
      // Parse PDF
      const buffer = await file.arrayBuffer()
      const data = await PDFParse(Buffer.from(buffer))
      text = data.text
    } else if (file.type === 'text/plain') {
      // Parse text file
      text = await file.text()
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'No text found in file' }, { status: 400 })
    }

    // Parse the syllabus text
    const result = await parseSyllabusText(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Parse error:', error)
    return NextResponse.json(
      { error: 'Failed to parse syllabus' },
      { status: 500 }
    )
  }
}