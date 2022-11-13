export const PortfolioEdit = {
    PortfolioEdit: [
      { name: 'type', type: 'string' },
      { name: 'category', type: 'uint256' },
      { name: 'style', type: 'uint256' },
      { name: 'id', type: 'uint256' },
      { name: 'value', type: 'string[]' }
  ]
}

export const AccountEdit = {
  Link: [
    { name: 'name', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  AccountEdit: [
    { name: 'type', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'avatar', type: 'string' },
    { name: 'links', type: 'Link[]'}
  ]
}

export default {
  PortfolioEdit,
  AccountEdit
}