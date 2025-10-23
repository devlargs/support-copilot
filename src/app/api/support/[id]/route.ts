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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await readDataFile()
        const response = data.responses.find((r) => r.id === id)

        if (!response) {
            return NextResponse.json(
                { error: 'Support response not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('GET /api/support/[id] error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch support response' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body: Partial<CreateSupportRequest> = await request.json()

        const data = await readDataFile()
        const index = data.responses.findIndex((r) => r.id === id)

        if (index === -1) {
            return NextResponse.json(
                { error: 'Support response not found' },
                { status: 404 }
            )
        }

        // Update the response
        data.responses[index] = {
            ...data.responses[index],
            ...body,
            updatedAt: new Date().toISOString(),
        }

        await writeDataFile(data)

        return NextResponse.json(data.responses[index])
    } catch (error) {
        console.error('PATCH /api/support/[id] error:', error)
        return NextResponse.json(
            { error: 'Failed to update support response' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await readDataFile()
        const index = data.responses.findIndex((r) => r.id === id)

        if (index === -1) {
            return NextResponse.json(
                { error: 'Support response not found' },
                { status: 404 }
            )
        }

        // Remove the response
        data.responses.splice(index, 1)

        await writeDataFile(data)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/support/[id] error:', error)
        return NextResponse.json(
            { error: 'Failed to delete support response' },
            { status: 500 }
        )
    }
}





