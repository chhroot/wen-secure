import { NextRequest, NextResponse } from 'next/server'
import { etherscanService } from '@/lib/services/etherscan'
import { isValidEthereumAddress } from '@/lib/ethereum'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractAddress = searchParams.get('address')

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

    return NextResponse.json(contractInfo)
  } catch (error) {
    console.error('Contract API error:', error)
    
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
          code: 'ETHERSCAN_ERROR'
        },
        { status }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch contract information',
        code: 'API_ERROR'
      },
      { status: 500 }
    )
  }
}