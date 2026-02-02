export const formatCurrency = (amount: string, currencyCode: string) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: currencyCode
	}).format(parseFloat(amount))
}
