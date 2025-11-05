/**
 * Validates if a string is a valid Ethereum contract address
 * @param address - The address string to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidEthereumAddress(address: string): boolean {
  // Check if address is a string
  if (typeof address !== 'string') {
    return false
  }

  // Remove any whitespace
  const cleanAddress = address.trim()

  // Check if it starts with '0x' and is exactly 42 characters long
  if (!cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
    return false
  }

  // Check if all characters after '0x' are valid hexadecimal
  const hexPart = cleanAddress.slice(2)
  const hexRegex = /^[0-9a-fA-F]+$/
  
  return hexRegex.test(hexPart)
}

/**
 * Formats an Ethereum address for display
 * @param address - The address to format
 * @param truncate - Whether to truncate the address for display
 * @returns formatted address string
 */
export function formatEthereumAddress(address: string, truncate = false): string {
  if (!isValidEthereumAddress(address)) {
    return address
  }

  const cleanAddress = address.trim().toLowerCase()
  
  if (truncate) {
    return `${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`
  }
  
  return cleanAddress
}

/**
 * Normalizes an Ethereum address to lowercase with 0x prefix
 * @param address - The address to normalize
 * @returns normalized address or throws error if invalid
 */
export function normalizeEthereumAddress(address: string): string {
  if (!isValidEthereumAddress(address)) {
    throw new Error('Invalid Ethereum address format')
  }
  
  return address.trim().toLowerCase()
}