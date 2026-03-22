export function shortenHash(hash: string, start = 8, end = 6): string {
  if (hash.length <= start + end) {
    return hash
  }

  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}

export function formatEth(value: number): string {
  if (value === 0) {
    return '0 ETH'
  }

  if (value < 0.0001) {
    return '< 0.0001 ETH'
  }

  const maximumFractionDigits = value >= 1 ? 4 : 6
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })} ETH`
}

export function formatGwei(value: number | null): string {
  if (value === null) {
    return 'n/a'
  }

  const maximumFractionDigits = value >= 1 ? 2 : 6
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })} Gwei`
}

export function formatUnixTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('ru-RU', {
    hour12: false,
  })
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU')
}
