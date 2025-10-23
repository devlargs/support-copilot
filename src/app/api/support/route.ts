import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { SupportResponse, CreateSupportRequest } from '@/types/support'

interface DataFile {
    responses: SupportResponse[]
}

const DATA_FILE_PATH = join(process.cwd(), 'public', 'data.json')

async function readDataFile(): Promise<DataFile> {
    try {
        const fileContent = await readFile(DATA_FILE_PATH, 'utf-8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error('Error reading data file:', error)
        return { responses: [] }
    }
}

async function writeDataFile(data: DataFile): Promise<void> {
    try {
        await writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
        console.error('Error writing data file:', error)
        throw new Error('Failed to write data file')
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '10', 10)
        const query = searchParams.get('query') || ''

        const data = await readDataFile()
        let filteredData = data.responses

        // Filter by search query if provided
        if (query) {
            const lowerQuery = query.toLowerCase()
            filteredData = filteredData.filter(
                (response) =>
                    response.question?.toLowerCase().includes(lowerQuery) ||
                    response.answer?.toLowerCase().includes(lowerQuery) ||
                    response.subject?.toLowerCase().includes(lowerQuery)
            )
        }

        // Calculate pagination
        const total = filteredData.length
        const totalPages = Math.ceil(total / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedData = filteredData.slice(startIndex, endIndex)

        return NextResponse.json({
            data: paginatedData,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        })
    } catch (error) {
        console.error('GET /api/support error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch support responses' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateSupportRequest = await request.json()

        // Validate required fields
        if (!body.question || !body.answer) {
            return NextResponse.json(
                { error: 'Question and answer are required' },
                { status: 400 }
            )
        }

        const data = await readDataFile()

        // Create new support response
        const newResponse: SupportResponse = {
            id: crypto.randomUUID(),
            subject: body.subject || '',
            question: body.question,
            answer: body.answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Add to beginning of array
        data.responses.unshift(newResponse)

        // Write back to file
        await writeDataFile(data)

        return NextResponse.json(newResponse, { status: 201 })
    } catch (error) {
        console.error('POST /api/support error:', error)
        return NextResponse.json(
            { error: 'Failed to create support response' },
            { status: 500 }
        )
    }
}





