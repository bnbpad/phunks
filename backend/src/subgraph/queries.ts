export const allTokenHolders = `
  query AllTokenHolders( $dbTokens: [String!], $blacklistedTokens: [String!]) {
    tokens(
    where: {
      and: [
        { address_in: $dbTokens },
        { address_not_in: $blacklistedTokens }
      ]
    }) {
      id
      totalSupply
      holders(first: 1000, orderBy: lastUpdated, orderDirection: desc) {
        holder
        amount
        lastUpdated
      }
    }
  }
`;

export const tokenHistory = `
  query MyQuery($dbTokens: [String!]) {
    tokens(
      where: {
        and: [
          { address_in: $dbTokens }
        ]
      }
    ) {
      id
      pool {
        token1
        totalNothVolume
      }
    }
  }
`;

export const marketCapPerToken = `
  query marketCap($formatAddress: String!) {
    tokens(first: 1, where: { id: $formatAddress }) {
      holderCount
      pool {
        token1
        totalNothVolume
      }
    }
  }
`;

export const getTokenHoldingQuery = `
  query MyQuery($formattedAddress: String!, $blacklistedTokens: [String!], $blacklistedTokens: [String!]) {
    tokens(
      where: {
        and: [
          {
            address_not_in: $blacklistedTokens
          },
          { holders_: { holder: $formattedAddress } }
        ]
      }
    ) {
      id
      holders(where: { holder: $formattedAddress }) {
        holder
        amount
      }
    }
  }
`;

export const getTokenHoldersQuery = `
  query MyQuery($tokenAddress: String!, $skip: Int!) {
    tokens(
      where: {
        and: [
          { address: $tokenAddress }
        ]
      }
    ) {
      id
      totalSupply
      holders(first: 1000, orderBy: amount, orderDirection: desc, skip: $skip where: { amount_gt: 0 }) {
        holder
        amount
      }
    }
  }
`;

export const getTokenQuery = `
  query Query($formattedAddress: String!, $blacklistedTokens: [String!]) {
    tokenHolding: tokens(
      first: 1,
      where: {
        and: [
          {
            address_not_in: $blacklistedTokens
          },
          { address: $formattedAddress }
        ]
      }
    ) {
      id
      name
      symbol
      totalSupply
      transactionHash
      fundingToken
      creator
      graduated
      metadata
      holderCount
      transactionHash
      holders {
        id
        amount
        lastUpdated
      }
      pool {
        pool
        token0
        token1
        totalNothVolume
      }
    }
  }
`;

export const listTokensQuery = `
  query ListTokens($skip: Int!, $limit: Int!, $dbTokens: [String!], $blacklistedTokens: [String!]) {
    tokens(
      first: $limit,
      skip: $skip,
      orderBy: createdAt,
      orderDirection: desc,
      where: {
        and: [
          { address_in: $dbTokens },
          {
            address_not_in: $blacklistedTokens
          }
        ]
      }
    ) {
      id
      totalSupply
      holderCount
      pool {
        pool
        token0
        token1
        totalNothVolume
      }
    }
  }
`;

export const tokenOfTheDay = `
  query TokenOfTheDay($dbTokens: [String!], $blacklistedTokens: [String!]) {
    tokens(
      where: {
        and: [
          { address_in: $dbTokens },
          {
            address_not_in: $blacklistedTokens
          }
        ]
      }
    ) {
      id
      totalSupply
      holderCount
      pool {
        pool
        token0
        token1
        totalNothVolume
      }
    }
  }
`;

export const getSingleTokenHoldingQuery = `
  query GetSingleTokenHolding($formattedAddress: String!, $tokenAddress: String!) {
    tokens (where : {id : $tokenAddress}) {
      id
      holders (where : { holder :$formattedAddress }) {
        holder
        amount
      }
    }
  }
`;

export const referralRewardQuery = `
query MyQuery($senders: [String], $premium: [String]) {
  pools(where:  {trade_: {txSender_in: $senders}, token0_not_in: $premium } ) {
    token0
    trade(where: {txSender_in: $senders}) {
      sender: txSender
      protocolFeesToken0
      protocolFeesToken1
    }
  }
 }
`;

export const airdropDistributionQuery = `
  query AirdropDistribution {
    airdropDistributions {
      id
      blockNumber
      amount
      totalVotingPower
    }
  }
`;

export const votingPowerSnapshotQuery = `
  query VotingPowerSnapshot($blockNumber: BigInt!, $walletAddress: Bytes!) {
    votingPowerSnapshots(
      block: {number: $blockNumber}
      where: {id: $walletAddress}
    ) {
      id
      votingPower
      blockNumber
    }
  }
`;
