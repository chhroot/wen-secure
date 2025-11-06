import { NextRequest, NextResponse } from 'next/server'
import { llmAuditService } from '@/lib/services/llm-audit'
import { etherscanService } from '@/lib/services/etherscan'
import { isValidEthereumAddress } from '@/lib/ethereum'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.contractAddress) {
      const { contractAddress } = body

      if (!contractAddress) {
        return NextResponse.json(
          { error: 'Contract address is required' },
          { status: 400 }
        )
      }

      if (!isValidEthereumAddress(contractAddress)) {
        return NextResponse.json(
          { error: 'Invalid Ethereum contract address' },
          { status: 400 }
        )
      }

      const contractInfo = await etherscanService.getContractSourceCode(contractAddress)
      
      const auditResult = await llmAuditService.auditContract(
        contractInfo.sourceCode, 
        contractInfo.contractName
      )

      return NextResponse.json({
        contractInfo,
        auditResult
      })
    } else {
      const { sourceCode, contractName } = body

      if (!sourceCode || !contractName) {
        return NextResponse.json(
          { error: 'Source code and contract name are required' },
          { status: 400 }
        )
      }

      const auditResult = await llmAuditService.auditContract(sourceCode, contractName)

      return NextResponse.json({ auditResult })
    }
  } catch (error) {
    console.error('Audit API error:', error)
    
    if (error instanceof Error) {
      const errorMessage = error.message
      let status = 500

      if (errorMessage.includes('not verified')) {
        status = 422
      } else if (errorMessage.includes('rate limit')) {
        status = 429
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        status = 503
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          code: 'API_ERROR'
        },
        { status }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to perform audit',
        code: 'API_ERROR'
      },
      { status: 500 }
    )
  }
}