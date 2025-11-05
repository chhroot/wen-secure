import { NextRequest, NextResponse } from 'next/server'
import { llmAuditService } from '@/lib/services/llm-audit'

export async function POST(request: NextRequest) {
  try {
    const { sourceCode, contractName } = await request.json()

    if (!sourceCode || !contractName) {
      return NextResponse.json(
        { error: 'Source code and contract name are required' },
        { status: 400 }
      )
    }

    const auditResult = await llmAuditService.auditContract(sourceCode, contractName)

    return NextResponse.json(auditResult)
  } catch (error) {
    console.error('Audit API error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to perform audit',
        code: 'API_ERROR'
      },
      { status: 500 }
    )
  }
}