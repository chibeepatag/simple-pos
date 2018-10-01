var dbMock = (function() {
	const products = [
 		{ id: 1,
 		  name: 'Nintendo Switch',
 	      retail_price: 250,
 	      tax_exempt: false,
 	    },
 		{ id: 2,
 		  name: 'iPhone 6',
 	      retail_price: 100,
 	      tax_exempt: false 
 	    },
 	    { id: 3,
 	      name: 'Sony PlayStation',
 	      retail_price: 300,
 	      tax_exempt: true 
 	    },
 	    { id: 4,
 	      name: 'XBox One',
 	      retail_price: 275,
 	      tax_exempt: false 
 	    },
 	]
 	const customers = [
 		{ id: 1,
 		  name: 'Helen Santos',
 		  discount: '5%',
 		  tax_exempt: false
 		},
 		{ id: 2,
 		  name: 'Peter Reyes',
 		  discount: '0',
 		  tax_exempt: true
 		}
 	]
 	const tax_rates = [
 		{ name: 'VAT',
 		  rate: '12%',
 		  tax_rate_type: 0,
 		},
 		{ name: 'Austin',
 		  rate: '5%',
 		  tax_rate_type: 1,
 		},
 		{ name: 'Excise',
 		  rate: '10%',
 		  tax_rate_type: 1,
 		},
 		{ name: 'Sin',
 		  rate: '2%',
 		  tax_rate_type: 1,
 		},
 	]

 	const settings = {
 		enableTax: { 
          code: 'enableTax',
          name: 'Enable compute tax',
 		  value: true
 		},
 		singleTax: { 
          code:  'singleTax',
          name: 'Single Tax',
 		  value: true
 		},
 		taxInclusive: {
          code: 'taxInclusive',
 		  name: 'Tax Inclusive',
 		  value: true
 		}
 	}

 	const openInvoice = {
 		invoiceLines: {},
 		customer: null,
 		amount: 0,
 		tax: 0,
 	}

 	return {
 		products: products,
 		customers: customers,
 		tax_rates: tax_rates,
 		settings: settings,
 		openInvoice: openInvoice,
 	}
})()