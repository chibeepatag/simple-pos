$("document").ready(function(){
    simplePos.initTabs();
    simplePos.listCustomers();
    simplePos.listProducts();
    simplePos.listSettings();
});

var simplePos = (function() {
    'use strict';

    function initTabs(){
        var tabs = [
            'Products',
            'Customers',
            'Settings',
        ]
        
        var html = "";
        var listTab = $("#list-tab");

        tabs.forEach(tab=>{
            // html += `<a class="list-group-item list-group-item-action" id="list-${tab.toLowerCase()}-list" data-toggle="list" href="#tab_${tab.toLowerCase()}" role="tab" aria-controls="${tab.toLowerCase()}">
            html += `<a class="nav-item nav-link" id="list-${tab.toLowerCase()}-list" href="#tab_${tab.toLowerCase()}" data-toggle="tab" role="tab" aria-controls="${tab.toLowerCase()}">
                            ${tab}
                        </a>`;

        });
        listTab.append(html);
        listTab.find('a:first-child').click();
        return true;        
    }

 	function listProducts(){
        var html = ''
 		dbMock.products.forEach(function(product){
 		var tax_exempt = 'no'
 		if(product.tax_exempt){
 			tax_exempt = 'yes'
 		}
        // html += `<div class='card col-sm-6 col-md-4 col-lg-2' id=product_${product.id} onclick="simplePos.addToInvoice(${product.id})">
        //                 <div class='card-body d-flex  flex-column'>
        //                     <div class='text-right'>
        //                         <sup> \$ ${product.retail_price}
        //                         ${tax_exempt === 'yes' ? '<br>Tax Exempted' : ''}
        //                         </sup>
        //                     </div>
        //                     <h3 class='card-title mt-auto'>${product.name}</h3>
        //                 </div>
        //             </div>`;
        // html += `<div class='container productItem border col-sm-6 col-md-4 col-lg-2 d-flex flex-column' id=product_${product.id} onclick="simplePos.addToInvoice(${product.id})">
        html += `<div class='col-sm-6 col-md-4 col-lg-2 productItem border' id=product_${product.id} onclick="simplePos.addToInvoice(${product.id})">
                    <div class='text-right'>
                        <sup> \$ ${product.retail_price}
                        ${tax_exempt === 'yes' ? '<br>Tax Exempted' : ''}
                        </sup>
                    </div>
                    <h3 class='mt-auto'>${product.name}</h3>
                </div>`;
 		});
        $("#products").append(html);
 		return true;
 	}

 	function listCustomers(){
        var html = '';
 		dbMock.customers.forEach(function(customer){
 			var tax_exempt = 'no'
	 		if(customer.tax_exempt){
	 			tax_exempt = 'yes'
	 		}
            // html += `<tr id=customer_${customer.id}>
            // 	<td>${customer.name}</td>
            // 	<td>${customer.discount}</td>
            // 	<td>${tax_exempt}</td>
            // 	<td><button class='btn' onclick="simplePos.setCustomer(${customer.id})">Set</button></td>
            // 	</tr>`
            html += `<div class='p-1 col-sm-6 col-md-4 col-lg-2 customerItem border' id='customer_${customer.id}' onclick="simplePos.setCustomer(${customer.id}, this)">
                    <h5 class='mt-auto'>${customer.name}</h5>
                    <div class='pl-4'>
                        <span>Discount: ${customer.discount}</span> <br/>
                        <span>Tax Exempt: ${tax_exempt}</span>
                    </div>
                </div>`;
        })
 		$("#customers").append(html);
 		return true;
 	}

 	function listSettings(){
 		var html = ""
 		var settings_values = Object.values(dbMock.settings)
 		settings_values.forEach(function(setting){
            var function_name = setting.code.charAt(0).toUpperCase() + setting.code.substring(1);
            html += `
            <div class='d-flex justify-content-start px-3 mb-2'>
                <div class='d-inline-block'>
                    <input type="checkbox" checked onclick="simplePos.toggle${function_name}()">
                    <span class="slider"></span>
                </div>
                <span class='pl-2' >${setting.name}</span>
            </div>
            `;
            
 		})
 		$("#settings").append(html)
 		return true;
 	}

 	function setCustomer(customerId, tgt = null){
 		var customer = dbMock.customers.find(function(customer){
 			return customer.id == customerId
 		})
 		dbMock.openInvoice.customer = customer
        $("#invoice_customer").html(dbMock.openInvoice.customer.name)
 		var discount = customer.discount
 		var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
 		invoiceLines.forEach(function(line){
 			setDiscount(line, discount)
 		})

        if(tgt !== null) {
            $('.customerItem.toggled').removeClass('toggled');
            // debugger;
            $(tgt).addClass('toggled');
        } 		
 	}

    function getDiscount(product){
        var discount = prompt("Enter discount:", "5%");
        var line = dbMock.openInvoice.invoiceLines[product]
        setDiscount(line, discount)
    }

    function setDiscount(line, discount){
        line.discount = discount
        var discount_rate = discount.split('%')[0]
        var discount_amount = 0;
        if (discount_rate > 0){
            discount_amount = computeDiscount(line.retail_price, line.quantity, discount_rate)
        }
        line.discount_amount = discount_amount;
        setTax(line);
        setLineSubtotal(line);
        refreshInvoice();
    }

    function computeDiscount(retail_price, quantity, rate){
        return retail_price * quantity * (rate/100)
    }

    function computeTax(taxableSales, tax_rate){
        var rate = tax_rate.split('%')[0]
        var tax = (taxableSales * rate/100)
        return tax;
    }

    function computeTaxableSale(retail_price, quantity, discount_amount, tax_rate, tax_inclusive){
        var taxableSales = 0
        var rate = parseFloat(tax_rate.split('%')[0])
        if(tax_inclusive){
            taxableSales = ((retail_price * quantity) - discount_amount)/( 1 + (rate/100))
        }else{
            taxableSales = (retail_price * quantity) - discount_amount
        }
        return taxableSales;
    }

    function setTax(line){
        if(!line.product.tax_exempt){
            var tax_rate = dbMock.tax_rates.find(function(_tax_rate){
            return _tax_rate.name == 'VAT'
            }).rate
            var tax_inclusive = dbMock.settings['taxInclusive'].value
            var taxableSales = computeTaxableSale(line.retail_price, line.quantity, line.discount_amount, tax_rate, tax_inclusive)
            line.taxableSales = taxableSales;
            line.tax_amount = parseFloat(computeTax(taxableSales, tax_rate).toFixed(2)) 
            setLineSubtotal(line);   
        }else{
            line.tax_amount = 0   
            line.taxableSales = 0;
        } 
    }

    function setLineSubtotal(line){
        var tax_inclusive = dbMock.settings['taxInclusive'].value
        var subtotal = computeSubtotal(line, tax_inclusive)
        line.subtotal = subtotal
        refreshInvoice();
    }

    function computeSubtotal(line, tax_inclusive){
        var lineSubtotal = 0
        if(tax_inclusive){
            lineSubtotal = (line.retail_price * line.quantity) - line.discount_amount
        }else{
            lineSubtotal = (line.retail_price * line.quantity) - line.discount_amount + line.tax_amount
        }
        return lineSubtotal
    }

 	function addToInvoice(productId){
 		var product = dbMock.products.find(function(product){
 			return product.id == productId
 		})
 		var line = dbMock.openInvoice.invoiceLines[product.name]
 		var quantity = 1
 		var discount = "0%"
        var discount_amount = 0
        if(line){
 			line.quantity = line.quantity + 1
            discount = line.discount
 		}else{            
            line = {product: product, quantity: quantity, retail_price: product.retail_price}
            if(dbMock.openInvoice.customer){
                discount = dbMock.openInvoice.customer.discount
            }
        }
        setDiscount(line, discount);
        setLineSubtotal(line);
 		dbMock.openInvoice.invoiceLines[product.name]= line
 		refreshInvoice();
 	}

 	function refreshInvoice(){
        setInvoiceSubtotal();
        setInvoiceDiscount();
        setInvoiceTotalTax();
        setInvoiceAmount();

 		var customer = dbMock.openInvoice.customer
 		if(customer){
 			$("#invoice_customer").html(dbMock.openInvoice.customer.name)	
 		}
 		var html = ""
        var invoice = dbMock.openInvoice;
 		var invoiceLines = Object.values(invoice.invoiceLines)
 		invoiceLines.forEach(function(line){
 			var line_html = `<tr>
                                <td class='d-flex justify-content-between align-bottom'>${line.product.name}</td>
 								<!--<td class='d-flex justify-content-between align-bottom'><span>${line.product.name}</span> &emsp; x&nbsp;${line.quantity}</td>-->
                                <td>${line.product.retail_price.toFixed(2)}</td>
 								<td>${line.quantity}</td>
 								<td onclick="simplePos.getDiscount('${line.product.name}');">${line.discount}</td>
 								<td>${line.subtotal.toFixed(2)}</td>
 							</tr>`
 			html = html.concat(line_html)
 		})
        $(".invoice_lines").html(html)
        $("#invoice_subtotal").html(invoice.subtotal.toFixed(2))
        $("#invoice_discount").html(invoice.discount_amount.toFixed(2))
        $("#invoice_total_tax").html(invoice.total_tax.toFixed(2))
        $("#amount_due").html(invoice.amount.toFixed(2))
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
 		resetInvoice()
        resetSettings()
 	}

    function resetInvoice(){
        dbMock.openInvoice.invoiceLines = []
        dbMock.openInvoice.customer = null
        dbMock.openInvoice.amount = 0
        dbMock.openInvoice.tax = 0
    }

    function resetSettings(){
        dbMock.settings['enableTax'].value = true;
        dbMock.settings['singleTax'].value = true
        dbMock.settings['taxInclusive'].value = true
    }

    function setInvoiceSubtotal(){
        var invoice = dbMock.openInvoice
        var subtotal = 0;
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        invoiceLines.forEach(function(line){
            subtotal += line.subtotal
        });

        invoice.subtotal = subtotal;
    }

    function setInvoiceDiscount(){
        var invoice = dbMock.openInvoice
        var discount = 0;
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        invoiceLines.forEach(function(line){
            discount += line.discount_amount
        });
        invoice.discount_amount = discount;
    }

    function setInvoiceTotalTax(){
        var invoice = dbMock.openInvoice
        var total_tax = 0;
        var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
        invoiceLines.forEach(function(line){
            total_tax += line.tax_amount
        });
        invoice.total_tax = parseFloat(total_tax.toFixed(2));
    }

    function setInvoiceAmount(){
        var invoice = dbMock.openInvoice
        var amount = 0;

        var invoiceLines = Object.values(invoice.invoiceLines)
        invoiceLines.forEach(function(line){
            amount = amount + line.subtotal
        });
        invoice.amount = parseFloat(amount.toFixed(2))
    }

    return {
        initTabs: initTabs,
        listProducts: listProducts,
        listCustomers: listCustomers,
        listSettings: listSettings,
        setCustomer: setCustomer,
        getDiscount: getDiscount,
        setDiscount: setDiscount,
        setLineSubtotal: setLineSubtotal,
        computeTaxableSale: computeTaxableSale,
        computeTax: computeTax,
        setTax: setTax,
        computeSubtotal: computeSubtotal,
        setInvoiceSubtotal: setInvoiceSubtotal,
        setInvoiceDiscount: setInvoiceDiscount,
        setInvoiceTotalTax: setInvoiceTotalTax,
        setInvoiceAmount: setInvoiceAmount,
        addToInvoice: addToInvoice,
        toggleEnableTax: toggleEnableTax,
        toggleTaxInclusive: toggleTaxInclusive,
        toggleSingleTax: toggleSingleTax, 
        reset: reset,
        resetSettings: resetSettings,
        resetInvoice: resetInvoice,
    };
}());