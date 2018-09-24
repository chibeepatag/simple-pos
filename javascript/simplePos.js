$("document").ready(function(){
	simplePos.listProductsCustomersSettings();
});

var simplePos = (function() {
    'use strict';
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
 	      retail_price: 100,
 	      tax_exempt: true 
 	    },
 	    { id: 4,
 	      name: 'XBox One',
 	      retail_price: 275,
 	      tax_exempt: false 
 	    },
 	]
 	const customers = [
 		{ name: 'Helen Santos',
 		  discount: '5%',
 		  tax_exempt: false
 		},
 		{
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
 	const settings = [
 		{ name: 'enable_compute_tax',
 		  value: true
 		},
 		{ name: 'single_tax',
 		  value: true
 		}
 	]

 	const openInvoice = {
 		invoiceLines: [],
 		customer: null,
 		amount: 0,
 		tax: 0,
 	}

 	function listProducts(){
 		products.forEach(function(product){
 		var html = `<tr id=product_${product.id}>
 				<td>${product.name}</td>
 				<td>${product.retail_price}</td>
 				<td>${product.tax_exempt}</td>
 				<td><button onclick="simplePos.addToInvoice(${product.id})">Add</button></td>
 			</tr>`
 		$("#products").append(html)
 		})
 		
 		console.table(products);
 		return true;
 	}

 	function listCustomers(){
 		console.table(customers);
 		return true;
 	}

 	function listSettings(){
 		console.table(settings);
 		return true;
 	}

 	function listProductsCustomersSettings(){
 		listCustomers();
 		listProducts();
 		listSettings();
 	}

 	function addToInvoice(productId){
 		var product = products.find(function(product){
 			return product.id == productId
 		})
 		console.log(`Adding product: ${product.name}`)
 		openInvoice.invoiceLines.push({product: product, quantity: 1})
 		refreshInvoice();
 	}

 	function refreshInvoice(){
 		var html = ""
 		openInvoice.invoiceLines.forEach(function(line){
 			var line_html = `<tr>
 								<td>${line.product.name}</td>
 								<td>${line.product.retail_price}</td>
 								<td>${line.quantity}</td>
 							</tr>`
 			html = html.concat(line_html)
 		})
 		$("#invoice_table").append(html)
 	}

 	function resetInvoice(){
 		openInvoice.invoiceLines = []
 		openInvoice.customer = null
 		openInvoice.amount = 0
 		openInvoice.tax = 0
 	}

    return {
    	listProductsCustomersSettings: listProductsCustomersSettings,
        listProducts: listProducts,
        listCustomers: listCustomers,
        listSettings: listSettings,
        addToInvoice: addToInvoice,
        openInvoice: openInvoice,
        resetInvoice: resetInvoice,
    };
}());