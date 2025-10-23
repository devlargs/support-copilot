import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { SupportResponse } from '@/types/support'

interface DataFile {
    responses: SupportResponse[]
}

const DATA_FILE_PATH = join(process.cwd(), 'public', 'data.json')

// Cache for the model to avoid reloading
let modelCache: any = null

async function loadModel() {
    if (modelCache) return modelCache

    // Dynamically import TensorFlow to avoid issues with server-side rendering
    const tf = await import('@tensorflow/tfjs-node')
    const use = await import('@tensorflow-models/universal-sentence-encoder')

    modelCache = await use.load()
    return modelCache
}

async function readDataFile(): Promise<DataFile> {
    try {
        const fileContent = await readFile(DATA_FILE_PATH, 'utf-8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error('Error reading data file:', error)
        return { responses: [] }
    }
}

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i]
        normA += a[i] * a[i]
        normB += b[i] * b[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) {
        return 0
    }

    return dotProduct / (normA * normB)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { query } = body

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Query parameter is required and must be a string' },
                { status: 400 }
            )
        }

        // Load the model and data
        const [model, data] = await Promise.all([loadModel(), readDataFile()])

        if (data.responses.length === 0) {
            return NextResponse.json({
                matches: [],
                message: 'No support responses found in database',
            })
        }

        // Prepare all questions for embedding
        const questions = data.responses.map((r) => r.question)
        const allTexts = [query, ...questions]

        // Get embeddings for all texts at once (more efficient)
        const embeddings = await model.embed(allTexts)
        const embeddingsArray = await embeddings.array()

        // First embedding is the query, rest are the questions
        const queryEmbedding = embeddingsArray[0]
        const questionEmbeddings = embeddingsArray.slice(1)

        // Calculate similarities
        const similarities = questionEmbeddings.map((questionEmbedding, index) => {
            const similarity = cosineSimilarity(queryEmbedding, questionEmbedding)
            return {
                response: data.responses[index],
                similarity,
                similarityPercentage: (similarity * 100).toFixed(2),
            }
        })

        // Sort by similarity (highest first)
        similarities.sort((a, b) => b.similarity - a.similarity)

        // Return top 5 most similar responses
        const topMatches = similarities.slice(0, 5)

        // Determine if there's a good match (similarity > 0.7 is generally considered good)
        const hasGoodMatch = topMatches.length > 0 && topMatches[0].similarity > 0.7

        return NextResponse.json({
            query,
            matches: topMatches,
            hasGoodMatch,
            bestMatch: topMatches[0] || null,
            message: hasGoodMatch
                ? 'Found similar questions in the database'
                : 'No highly similar questions found',
        })
    } catch (error) {
        console.error('POST /api/support/analyzeQuestion error:', error)
        return NextResponse.json(
            {
                error: 'Failed to analyze question',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

