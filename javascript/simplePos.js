$("document").ready(function(){
	simplePos.listCustomers();
    simplePos.listProducts();
    simplePos.listSettings();
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

 	function listProducts(){
 		products.forEach(function(product){
 		var tax_exempt = 'no'
 		if(product.tax_exempt){
 			tax_exempt = 'yes'
 		}
 		var html = `<tr id=product_${product.id}>
 				<td>${product.name}</td>
 				<td>${product.retail_price}</td>
 				<td>${tax_exempt}</td>
 				<td><button onclick="simplePos.addToInvoice(${product.id})">Add</button></td>
 			</tr>`
 		$("#products").append(html)
 		})
 		return true;
 	}

 	function listCustomers(){
 		customers.forEach(function(customer){
 			var tax_exempt = 'no'
	 		if(customer.tax_exempt){
	 			tax_exempt = 'yes'
	 		}
 			var html = `<tr id=customer_${customer.id}>
 				<td>${customer.name}</td>
 				<td>${customer.discount}</td>
 				<td>${tax_exempt}</td>
 				<td><button onclick="simplePos.setCustomer(${customer.id})">Set</button></td>
 				</tr>`
 			$("#customers").append(html)
 		})
 		return true;
 	}

 	function listSettings(){
 		var html = ""
 		var settings_values = Object.values(settings)
 		settings_values.forEach(function(setting){
            var function_name = setting.code.charAt(0).toUpperCase() + setting.code.substring(1);
 			html += `<tr>
                    <td>${setting.name}</td>
                    <td>
                        <input type="checkbox" checked onclick="simplePos.toggle${function_name}()">
                        <span class="slider"></span>
                   </td>
                   </tr>`
            
 		})
 		$("#settings").append(html)
 		return true;
 	}

 	function setCustomer(customerId){
 		var customer = customers.find(function(customer){
 			return customer.id == customerId
 		})
 		openInvoice.customer = customer
 		var discount = customer.discount
 		var invoiceLines = Object.values(openInvoice.invoiceLines)
 		invoiceLines.forEach(function(line){
 			line.discount = discount
 		})
 		refreshInvoice()
 	}

 	function addToInvoice(productId){
 		var product = products.find(function(product){
 			return product.id == productId
 		})
 		var line = openInvoice.invoiceLines[product.name]
 		var quantity = 1
 		if(line){
 			quantity = line.quantity + 1
 		}
 		var discount = 0
 		if(openInvoice.customer){
 			discount = openInvoice.customer.discount
 		}
 		openInvoice.invoiceLines[product.name]= {product: product, quantity: quantity, retail_price: product.retail_price, discount: discount, subtotal: 0}  
 		refreshInvoice();
 	}

 	function refreshInvoice(){
 		var customer = openInvoice.customer
 		if(customer){
 			$("#invoice_customer").html(openInvoice.customer.name)	
 		}
 		var html = ""
 		var invoiceLines = Object.values(openInvoice.invoiceLines)
 		invoiceLines.forEach(function(line){
 			var line_html = `<tr>
 								<td>${line.product.name}</td>
 								<td>${line.product.retail_price}</td>
 								<td>${line.quantity}</td>
 								<td>${line.discount}</td>
 								<td>${line.subtotal}</td>
 							</tr>`
 			html = html.concat(line_html)
 		})
 		$(".invoice_lines").html(html)
 	}

    function toggleEnableTax(){
       console.log("toggleEnableTax: ", settings['enableTax'].value)
       settings['enableTax'].value = !settings['enableTax'].value;
       console.log("toggleEnableTax: ", settings['enableTax'].value)
    }

    function toggleTaxInclusive(){
        settings['taxInclusive'].value = !settings['taxInclusive'].value;
    }

    function toggleSingleTax(){
        settings['singleTax'].value = !settings['singleTax'].value;
    }

 	function reset(){
 		openInvoice.invoiceLines = []
 		openInvoice.customer = null
 		openInvoice.amount = 0
 		openInvoice.tax = 0

        settings['enableTax'].value = true;
        settings['singleTax'].value = true
        settings['taxInclusive'].value = true
 	}

    return {
        listProducts: listProducts,
        listCustomers: listCustomers,
        listSettings: listSettings,
        setCustomer: setCustomer,
        addToInvoice: addToInvoice,
        openInvoice: openInvoice,
        settings: settings,
        toggleEnableTax: toggleEnableTax,
        toggleTaxInclusive: toggleTaxInclusive,
        toggleSingleTax: toggleSingleTax, 
        reset: reset,
    };
}());