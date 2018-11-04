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
 		
        setInvoiceDiscount()
        refreshInvoice()
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

        setInvoiceDiscount()
 		refreshInvoice();   
 	}

 	function refreshInvoice(){
 		var customer = dbMock.openInvoice.customer
 		if(customer){
 			$("#invoice_customer").html(dbMock.openInvoice.customer.name)	
 		}
 		var html = ""
 		var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        var taxInclusive = dbMock.settings.taxInclusive.value
 		invoiceLines.forEach(function(line){
 			var line_html = `<tr>
 								<td>${line.product.name}</td>
 								<td>${line.product.retail_price}</td>
 								<td><input type="number" 
                                    id="quantity_${line.product.id}" min="1" value="${line.quantity}" 
                                    onChange="simplePos.updateLines(${line.product.id})"></td>
 								<td>${line.discount}</td>
 								<td>${ taxInclusive ? line.nontaxed_amount : line.taxed_amount }</td>
 							</tr>`
 			html = html.concat(line_html)
 		})
 		$(".invoice_lines").html(html)
 	}
    
    function updateLines(productId) {
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

        setInvoiceDiscount()
        refreshInvoice()        
    }

    function getDiscount(amount, percentage) {
        return amount * percentToDec(percentage)
    }

    function setDiscount(line, discount) {
        line.discount = discount
        line.discount_amount = getDiscount(line.product.retail_price * line.quantity, discount)
    }

    function computeTaxableSale(retail_price, quantity, discount_amount, tax_rate, tax_inclusive) {
        var total_retail = retail_price * quantity
        var discount_reduced = total_retail - discount_amount
        if(tax_inclusive) {
            var tax_precentage = percentToDec(dbMock.tax_rates[0].rate)
            return discount_reduced - computeTax(discount_reduced, tax_rate)/(tax_precentage+1)
        } else {
            return discount_reduced
        }
    }

    function computeTax(taxable_sales, tax_rate) { 
        return taxable_sales * percentToDec(tax_rate)
    }

    function percentToDec(tax_rate) {
        return parseInt(tax_rate) * 0.01
    }

    function setTax(line) {
        if(line.product.tax_exempt) {
            line.tax_amount = 0
        } else {
            var tax_inclusive = dbMock.settings['taxInclusive'].value
            var tax_rate = dbMock.tax_rates[0].rate
            var discount_amount = getDiscount(line.product.retail_price * line.quantity, line.discount)
            var taxable_sales = computeTaxableSale(line.product.retail_price, line.quantity, discount_amount, tax_rate, tax_inclusive)
            line.tax_amount = parseFloat(computeTax(taxable_sales, tax_rate).toFixed(2))
        }
    }

    function setLineSubtotal(line) {
        var total = line.product.retail_price * line.quantity
        var tax_inclusive = dbMock.settings.taxInclusive.value
        
        line.subtotal = total - line.discount_amount
        if(!tax_inclusive) { line.subtotal += line.tax_amount }

        line.taxed_amount = total - line.discount_amount + line.tax_amount
        line.nontaxed_amount = total - line.discount_amount
    }

    function setInvoiceDiscount() {
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        var total = 0
        var customer = dbMock.openInvoice.customer
        var customerDiscount = customer ? customer.discount : "0%"
        invoiceLines.forEach(function(line) {
            setDiscount(line, customerDiscount)
            total += line.discount_amount
        })
        dbMock.openInvoice.discount_amount = parseFloat(total.toFixed(2))
        setInvoiceTotalTax()
    }

    function setInvoiceTotalTax() {
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        var total = 0
        var customer = dbMock.openInvoice.customer
        var customerDiscount = customer ? customer.discount : "0%"
        invoiceLines.forEach(function(line) {
            setTax(line)
            total += line.tax_amount
        })
        dbMock.openInvoice.total_tax = parseFloat(total.toFixed(2))
        setInvoiceSubtotal()
    }

    function setInvoiceSubtotal() {
        var tax_inclusive = dbMock.settings.taxInclusive.value
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        var total = 0
        var customer = dbMock.openInvoice.customer
        var customerDiscount = customer ? customer.discount : "0%"
        invoiceLines.forEach(function(line) {
            setLineSubtotal(line)
            total += line.nontaxed_amount
        })
        dbMock.openInvoice.subtotal = parseFloat(total.toFixed(2))
        setInvoiceAmount()
    }

    function setInvoiceAmount() {
        var tax_inclusive = dbMock.settings.taxInclusive.value
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        var total = 0
        var customer = dbMock.openInvoice.customer
        var customerDiscount = customer ? customer.discount : "0%"
        invoiceLines.forEach(function(line) {
            total += line.subtotal 
        })
        dbMock.openInvoice.amount = parseFloat(total.toFixed(2))
        refreshSummary()
    }

    function refreshSummary() {
        var invoice = dbMock.openInvoice
        var subtotalLbl = $('#subtotal')[0]
        var taxLbl = $('#total_tax')[0]
        var amntLbl = $('#amount_due')[0]
        var discLbl = $('#discount')[0]
        
        if(subtotalLbl) {
            subtotal.innerText = invoice.subtotal
            taxLbl.innerText = invoice.total_tax
            amntLbl.innerText = invoice.amount
            discLbl.innerText = invoice.discount_amount
        }
    }

    function toggleEnableTax(){
       dbMock.settings['enableTax'].value = !dbMock.settings['enableTax'].value;
       setInvoiceDiscount()
       refreshInvoice()
    }

    function toggleTaxInclusive(){
        dbMock.settings['taxInclusive'].value = !dbMock.settings['taxInclusive'].value;
        setInvoiceDiscount()
        refreshInvoice()
    }

    function toggleSingleTax(){
        dbMock.settings['singleTax'].value = !dbMock.settings['singleTax'].value;
    }

 	function reset(){
        resetInvoice()
        dbMock.settings['enableTax'].value = true
        dbMock.settings['singleTax'].value = true
        dbMock.settings['taxInclusive'].value = true
 	}

    function resetInvoice() {
        dbMock.openInvoice.invoiceLines = []
        dbMock.openInvoice.customer = null
        dbMock.openInvoice.amount = 0
        dbMock.openInvoice.tax = 0   
    }

    return {
        listProducts: listProducts,
        listCustomers: listCustomers,
        listSettings: listSettings,
        setCustomer: setCustomer,
        addToInvoice: addToInvoice,
        updateLines: updateLines,
        getDiscount: getDiscount,
        toggleEnableTax: toggleEnableTax,
        toggleTaxInclusive: toggleTaxInclusive,
        toggleSingleTax: toggleSingleTax, 
        reset: reset,
        setDiscount: setDiscount,
        computeTaxableSale: computeTaxableSale,
        computeTax: computeTax,
        setTax: setTax,
        setLineSubtotal: setLineSubtotal,
        setInvoiceSubtotal: setInvoiceSubtotal,
        setInvoiceDiscount: setInvoiceDiscount,
        setInvoiceTotalTax: setInvoiceTotalTax,
        resetInvoice: resetInvoice
    };
}());