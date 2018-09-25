$("document").ready(function(){
	simplePos.listCustomers();
    simplePos.listProducts();
    simplePos.listSettings();
});

var simplePos = (function() {
    'use strict';

 	function listProducts(){
 		dbMock.products.forEach(function(product){
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
 		dbMock.customers.forEach(function(customer){
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
 		var settings_values = Object.values(dbMock.settings)
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
 		var customer = dbMock.customers.find(function(customer){
 			return customer.id == customerId
 		})
 		dbMock.openInvoice.customer = customer
 		var discount = customer.discount
 		var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
 		invoiceLines.forEach(function(line){
 			setDiscount(line.product.name, discount)
 		})
 		refreshInvoice()
 	}

    function getDiscount(product){
        var discount = prompt("Enter discount:", "5%");
        setDiscount(product, discount)
    }

    function setDiscount(product, discount){
        console.log(product, discount)
        var line = dbMock.openInvoice.invoiceLines[product]
        line.discount = discount
        var discount_rate = discount.split('%')[0]
        var discount_amount = computeDiscount(dbMock.openInvoice.invoiceLines[product].retail_price, dbMock.openInvoice.invoiceLines[product].quantity, discount_rate)
        line.discount_amount = discount_amount
        setSubtotal(line)
        refreshInvoice();
    }

    function computeDiscount(retail_price, quantity, rate){
        return retail_price * quantity * (rate/100)
    }

    function setSubtotal(line){
        var subtotal = computeSubtotal(line)
        line.subtotal = subtotal
        refreshInvoice();
    }
    function computeSubtotal(line){
        return line.retail_price * line.quantity - line.discount_amount
    }

 	function addToInvoice(productId){
 		var product = dbMock.products.find(function(product){
 			return product.id == productId
 		})
 		var line = dbMock.openInvoice.invoiceLines[product.name]
 		var quantity = 1
 		if(line){
 			quantity = line.quantity + 1
 		}
 		var discount = 0
 		if(dbMock.openInvoice.customer){
 			discount = dbMock.openInvoice.customer.discount
 		}
        var line = {product: product, quantity: quantity, retail_price: product.retail_price, discount: discount, discount_amount: 0, subtotal: 0}
        setSubtotal(line)
 		dbMock.openInvoice.invoiceLines[product.name]= line
 		refreshInvoice();
 	}

 	function refreshInvoice(){
 		var customer = dbMock.openInvoice.customer
 		if(customer){
 			$("#invoice_customer").html(dbMock.openInvoice.customer.name)	
 		}
 		var html = ""
 		var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
 		invoiceLines.forEach(function(line){
 			var line_html = `<tr>
 								<td>${line.product.name}</td>
 								<td>${line.product.retail_price}</td>
 								<td>${line.quantity}</td>
 								<td onclick="simplePos.getDiscount('${line.product.name}');">${line.discount}</td>
 								<td>${line.subtotal}</td>
 							</tr>`
 			html = html.concat(line_html)
 		})
 		$(".invoice_lines").html(html)
 	}

    function toggleEnableTax(){
       dbMock.settings['enableTax'].value = !dbMock.settings['enableTax'].value;
    }

    function toggleTaxInclusive(){
        dbMock.settings['taxInclusive'].value = !dbMock.settings['taxInclusive'].value;
    }

    function toggleSingleTax(){
        dbMock.settings['singleTax'].value = !dbMock.settings['singleTax'].value;
    }

 	function reset(){
 		dbMock.openInvoice.invoiceLines = []
 		dbMock.openInvoice.customer = null
 		dbMock.openInvoice.amount = 0
 		dbMock.openInvoice.tax = 0

        dbMock.settings['enableTax'].value = true;
        dbMock.settings['singleTax'].value = true
        dbMock.settings['taxInclusive'].value = true
 	}

    return {
        listProducts: listProducts,
        listCustomers: listCustomers,
        listSettings: listSettings,
        setCustomer: setCustomer,
        getDiscount: getDiscount,
        setDiscount: setDiscount,
        setSubtotal: setSubtotal,
        computeSubtotal: computeSubtotal,
        addToInvoice: addToInvoice,
        toggleEnableTax: toggleEnableTax,
        toggleTaxInclusive: toggleTaxInclusive,
        toggleSingleTax: toggleSingleTax, 
        reset: reset,
    };
}());