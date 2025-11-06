import axios from 'axios'
import { normalizeEthereumAddress } from '../ethereum'

export interface EtherscanSourceCode {
  SourceCode: string
  ABI: string
  ContractName: string
  CompilerVersion: string
  OptimizationUsed: string
  Runs: string
  ConstructorArguments: string
  EVMVersion: string
  Library: string
  LicenseType: string
  Proxy: string
  Implementation: string
  SwarmSource: string
}

export interface EtherscanApiResponse {
  status: string
  message: string
  result: EtherscanSourceCode[]
}

export interface ContractSourceInfo {
  contractName: string
  sourceCode: string
  abi: string
  compilerVersion: string
  optimizationUsed: boolean
  isVerified: boolean
  isProxy: boolean
  implementationAddress?: string
}

export class EtherscanError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_ADDRESS' | 'NOT_VERIFIED' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'API_ERROR'
  ) {
    super(message)
    this.name = 'EtherscanError'
  }
}

class EtherscanService {
  private readonly baseUrl = 'https://api.etherscan.io/v2/api'
  private readonly apiKey: string

  constructor() {
    this.apiKey = process.env.ETHERSCAN_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Etherscan API key not found. Some features may not work.')
    }
  }

  async getContractSourceCode(contractAddress: string): Promise<ContractSourceInfo> {
    try {
      const normalizedAddress = normalizeEthereumAddress(contractAddress)
      
      const response = await axios.get<EtherscanApiResponse>(this.baseUrl, {
        params: {
          chainId: 1,
          module: 'contract',
          action: 'getsourcecode',
          address: normalizedAddress,
          apikey: this.apiKey
        },
        timeout: 10000
      })

      if (response.data.status !== '1') {
        if (response.data.message === 'NOTOK') {
          throw new EtherscanError('Failed to fetch contract data', 'API_ERROR')
        }
        throw new EtherscanError(response.data.message, 'API_ERROR')
      }

      const result = response.data.result[0]
      
      if (!result || !result.SourceCode) {
        throw new EtherscanError(
          'Contract source code not verified on Etherscan',
          'NOT_VERIFIED'
        )
      }

      let sourceCode = result.SourceCode
      if (sourceCode.startsWith('{{') && sourceCode.endsWith('}}')) {
        try {
          const jsonSource = sourceCode.slice(1, -1)
          const parsedSource = JSON.parse(jsonSource)
          
          if (parsedSource.sources) {
            sourceCode = Object.entries(parsedSource.sources as Record<string, { content: string }>)
              .map(([filename, fileData]) => {
                return `// File: ${filename}\n${fileData.content}\n\n`
              })
              .join('')
          }
        } catch (parseError) {
          console.warn('Failed to parse multi-file contract source:', parseError)
        }
      }

      return {
        contractName: result.ContractName,
        sourceCode,
        abi: result.ABI,
        compilerVersion: result.CompilerVersion,
        optimizationUsed: result.OptimizationUsed === '1',
        isVerified: true,
        isProxy: result.Proxy === '1',
        implementationAddress: result.Implementation || undefined
      }

    } catch (error) {
      if (error instanceof EtherscanError) {
        throw error
      }

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new EtherscanError('Request timeout - please try again', 'NETWORK_ERROR')
        }
        
        if (error.response?.status === 429) {
          throw new EtherscanError('Rate limit exceeded - please wait and try again', 'RATE_LIMITED')
        }
        
        if (error.response?.status && error.response.status >= 500) {
          throw new EtherscanError('Etherscan service temporarily unavailable', 'NETWORK_ERROR')
        }
      }

      throw new EtherscanError(
        `Failed to fetch contract data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NETWORK_ERROR'
      )
    }
  }

  async validateContract(contractAddress: string): Promise<boolean> {
    try {
      await this.getContractSourceCode(contractAddress)
      return true
    } catch {
      return false
    }
  }
}

export const etherscanService = new EtherscanService()