import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface AuditResult {
  executiveSummary: string
  criticalVulnerabilities: Vulnerability[]
  mediumSeverityIssues: Vulnerability[]
  lowSeverityIssues: Vulnerability[]
  gasOptimizations: string[]
  codeQualityAssessment: string
  recommendations: string[]
}

export interface Vulnerability {
  title: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  description: string
  location?: string
  impact: string
  recommendation: string
}

export class LLMAuditError extends Error {
  constructor(
    message: string,
    public code: 'API_ERROR' | 'RATE_LIMITED' | 'INVALID_RESPONSE' | 'NETWORK_ERROR'
  ) {
    super(message)
    this.name = 'LLMAuditError'
  }
}

const SECURITY_AUDIT_PROMPT = `You are a senior smart contract security auditor with expertise in Solidity and Ethereum security patterns. Analyze the provided smart contract source code for security vulnerabilities, gas optimizations, and code quality issues.

Please provide a comprehensive security audit report in the following JSON format:

{
  "executiveSummary": "Brief overview of the contract's purpose and overall security posture",
  "criticalVulnerabilities": [
    {
      "title": "Vulnerability name",
      "severity": "Critical",
      "description": "Detailed description of the vulnerability",
      "location": "Function/line where issue occurs",
      "impact": "Potential impact on users/funds",
      "recommendation": "How to fix this issue"
    }
  ],
  "mediumSeverityIssues": [...],
  "lowSeverityIssues": [...],
  "gasOptimizations": [
    "Specific gas optimization suggestions"
  ],
  "codeQualityAssessment": "Overall assessment of code quality, patterns, and best practices",
  "recommendations": [
    "General recommendations for improving security and functionality"
  ]
}

Focus on these security areas:
- Reentrancy vulnerabilities
- Integer overflow/underflow
- Access control issues
- Front-running and MEV vulnerabilities
- Flash loan attacks
- Oracle manipulation
- Logic errors and edge cases
- Gas limit and DoS vulnerabilities
- Timestamp dependence
- Block gas limit issues
- Unchecked external calls
- State variable visibility
- Function visibility and modifiers
- Input validation
- Emergency stop mechanisms

Provide actionable, specific recommendations with code examples where helpful.

Contract source code to audit:`

class LLMAuditService {
  private openai?: OpenAI
  private anthropic?: Anthropic
  private gemini?: GoogleGenerativeAI

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey })
    }

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey })
    }

    if (geminiKey) {
      this.gemini = new GoogleGenerativeAI(geminiKey)
    }

    if (!this.openai && !this.anthropic && !this.gemini) {
      console.warn('No LLM API keys found. Audit functionality will not work.')
    }
  }

  private async auditWithOpenAI(sourceCode: string, contractName: string): Promise<AuditResult> {
    if (!this.openai) {
      throw new LLMAuditError('OpenAI API key not configured', 'API_ERROR')
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: SECURITY_AUDIT_PROMPT
          },
          {
            role: 'user',
            content: `Contract Name: ${contractName}\n\n${sourceCode}`
          }
        ],
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new LLMAuditError('Empty response from OpenAI', 'INVALID_RESPONSE')
      }

      return this.parseAuditResponse(content)
    } catch (error) {
      if (error instanceof LLMAuditError) {
        throw error
      }

      throw new LLMAuditError(
        `OpenAI audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR'
      )
    }
  }

  private async auditWithClaude(sourceCode: string, contractName: string): Promise<AuditResult> {
    if (!this.anthropic) {
      throw new LLMAuditError('Anthropic API key not configured', 'API_ERROR')
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: `${SECURITY_AUDIT_PROMPT}\n\nContract Name: ${contractName}\n\n${sourceCode}`
          }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new LLMAuditError('Invalid response format from Claude', 'INVALID_RESPONSE')
      }

      return this.parseAuditResponse(content.text)
    } catch (error) {
      if (error instanceof LLMAuditError) {
        throw error
      }

      throw new LLMAuditError(
        `Claude audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR'
      )
    }
  }

  private async auditWithGemini(sourceCode: string, contractName: string): Promise<AuditResult> {
    if (!this.gemini) {
      throw new LLMAuditError('Gemini API key not configured', 'API_ERROR')
    }

    try {
      const model = this.gemini.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          maxOutputTokens: 60000,
        }
      })

      
      const prompt = `${SECURITY_AUDIT_PROMPT}\n\nContract Name: ${contractName}\n\n${sourceCode}`
      console.log(prompt)
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      if (!text) {
        throw new LLMAuditError('Empty response from Gemini', 'INVALID_RESPONSE')
      }

      return this.parseAuditResponse(text)
    } catch (error) {
      if (error instanceof LLMAuditError) {
        throw error
      }

      throw new LLMAuditError(
        `Gemini audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'API_ERROR'
      )
    }
  }

  private parseAuditResponse(response: string): AuditResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      if (!parsed.executiveSummary || !Array.isArray(parsed.criticalVulnerabilities)) {
        throw new Error('Invalid response structure')
      }

      return {
        executiveSummary: parsed.executiveSummary || '',
        criticalVulnerabilities: parsed.criticalVulnerabilities || [],
        mediumSeverityIssues: parsed.mediumSeverityIssues || [],
        lowSeverityIssues: parsed.lowSeverityIssues || [],
        gasOptimizations: parsed.gasOptimizations || [],
        codeQualityAssessment: parsed.codeQualityAssessment || '',
        recommendations: parsed.recommendations || []
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response, creating fallback result:', parseError)
      
      return {
        executiveSummary: 'Security audit completed. Please review the detailed analysis below.',
        criticalVulnerabilities: [],
        mediumSeverityIssues: [],
        lowSeverityIssues: [],
        gasOptimizations: [],
        codeQualityAssessment: response,
        recommendations: ['Please review the analysis manually due to parsing issues.']
      }
    }
  }


  async auditContract(sourceCode: string, contractName: string): Promise<AuditResult> {
    if (!sourceCode.trim()) {
      throw new LLMAuditError('Source code is required for audit', 'API_ERROR')
    }

    if (this.anthropic) {
      try {
        return await this.auditWithClaude(sourceCode, contractName)
      } catch (error) {
        console.warn('Claude audit failed, trying Gemini:', error)
      }
    }

    if (this.openai) {
      try {
        console.log('Auditing with OpenAI')
        return await this.auditWithOpenAI(sourceCode, contractName)
      } catch (error) {
        console.warn('OpenAI audit failed, trying Gemini:', error)
      }
    }

    if (this.gemini) {
      return await this.auditWithGemini(sourceCode, contractName)
    }

    throw new LLMAuditError('No LLM service available', 'API_ERROR')
  }
}

export const llmAuditService = new LLMAuditService()