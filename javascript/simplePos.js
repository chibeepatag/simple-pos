$("document").ready(function(){
    // db.fetchData().then(() => {
    //     simplePos.listCustomers();
    //     simplePos.listProducts();
    //     simplePos.listSettings();    
    // });

    simplePos.listCustomers();
    simplePos.listProducts();
    simplePos.listSettings();    
    simplePos.setCustomer(1)
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
 			line.discount = discount
 		})
 		refreshInvoice()
        refreshSummary()
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
 		dbMock.openInvoice.invoiceLines[product.name]= {
            product: product, 
            quantity: quantity, 
            retail_price: product.retail_price, 
            discount: discount, 
            subtotal: product.retail_price * quantity
        }

 		refreshInvoice();
        refreshSummary()
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
 								<td><input type="number" id="quantity_${line.product.id}" min="1" value="${line.quantity}" onChange="simplePos.updateLines(${line.product.id})"></td>
 								<td>${line.discount}</td>
 								<td>${line.subtotal}</td>
 							</tr>`
 			html = html.concat(line_html)
 		})
 		$(".invoice_lines").html(html)
 	}
    
    function updateLines(productId) {
        console.log("update " + productId)
        var product = dbMock.products.find(function(product){
            return product.id == productId
        })

        var line = dbMock.openInvoice.invoiceLines[product.name]
        var quantity = parseInt(document.getElementById("quantity_" + line.product.id).value)
        var discount = 0
        if(dbMock.openInvoice.customer){
            discount = dbMock.openInvoice.customer.discount
        }

        dbMock.openInvoice.invoiceLines[product.name] = {
            product: product, 
            quantity: quantity, 
            retail_price: product.retail_price, 
            discount: discount, 
            subtotal: product.retail_price * quantity
        }  

        refreshInvoice()
        refreshSummary()
    }

    function refreshSummary() {
        var taxEnabled = dbMock.settings['enableTax'].value
        var taxInclusive = dbMock.settings['taxInclusive'].value
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        var taxPercentage = parseInt(dbMock.tax_rates[0].rate) * 0.01
        var customerExempt = dbMock.openInvoice.customer.tax_exempt
        var subtotal = 0
        var discount = 0
        var tax = 0
        var taxOffset = 0
        invoiceLines.forEach(function(line){
            subtotal += line.retail_price * line.quantity
            discount += line.retail_price * line.quantity * parseInt(line.discount) * 0.01
            if(taxEnabled) {
                // need to compute tax separately
                if(!taxInclusive) {
                    // customer is exempted
                    // item is tax exempted
                    // do not add tax
                    if(customerExempt || line.product.tax_exempt) { return }

                    tax += line.retail_price * line.quantity * taxPercentage

                // tax embedded in price
                } else {

                    // price without tax
                    const taxExclusive = ((line.retail_price * line.quantity)/(taxPercentage+1))

                    // item is tax exempted, retain price and tax
                    if(line.product.tax_exempt) { return }
                    
                    // customer is exempted
                    // remove tax from price
                    if(customerExempt) {
                        taxOffset -= (line.retail_price * line.quantity) - taxExclusive
                    } else { 
                        // add to tax computed
                        tax += (line.retail_price * line.quantity) - taxExclusive 
                    }
                }
            }
        })

        document.getElementById('subtotal').innerText = subtotal
        
        if(!taxInclusive) {
            document.getElementById('total_tax').innerText = tax
            document.getElementById('amount_due').innerText = subtotal - discount + tax
            document.getElementById('discount').innerText = discount
        } else {
            const totalDiscount = (subtotal + taxOffset) * (parseInt(dbMock.openInvoice.customer.discount) * 0.01)
            document.getElementById('discount').innerText = totalDiscount
            if(customerExempt) {
                document.getElementById('total_tax').innerText = taxOffset
            } else {
                document.getElementById('total_tax').innerText = tax
            }
            document.getElementById('amount_due').innerText = subtotal - totalDiscount + taxOffset
        }
    }

    function toggleEnableTax(){
       dbMock.settings['enableTax'].value = !dbMock.settings['enableTax'].value;
       refreshSummary()
    }

    function toggleTaxInclusive(){
        dbMock.settings['taxInclusive'].value = !dbMock.settings['taxInclusive'].value;
        refreshSummary()
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
        addToInvoice: addToInvoice,
        updateLines: updateLines,
        toggleEnableTax: toggleEnableTax,
        toggleTaxInclusive: toggleTaxInclusive,
        toggleSingleTax: toggleSingleTax, 
        reset: reset,
    };
}());