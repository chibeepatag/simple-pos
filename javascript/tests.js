QUnit.test( "Add Product To Invoice", function( assert ) {
  simplePos.reset();
  simplePos.addToInvoice(1) 
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.product.id, 1, "Line product" );
  assert.equal( line.quantity, 1, "Line quantity" );
  assert.equal( line.retail_price, line.product.retail_price, "Line retail price" );

  simplePos.addToInvoice(1)
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.quantity, 2, "Line quantity increments" );

  simplePos.addToInvoice(1)
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.quantity, 3, "Line quantity increments" );
});

QUnit.test("Set Invoice Customer", function( assert ){
  simplePos.reset();
  simplePos.addToInvoice(1) 
  simplePos.setCustomer(1)
  assert.equal( dbMock.openInvoice.customer.id, 1, "Invoice customer")
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal(line.discount, '5%', "Customer discount - Add product before customer")

  simplePos.addToInvoice(2)
  line = dbMock.openInvoice.invoiceLines['iPhone 6']
  assert.equal(line.discount, '5%', "Customer discount - Add customer before product")    
})

QUnit.test("Toggle Tax", function(assert){
	simplePos.reset();
	simplePos.toggleEnableTax();
	assert.equal(dbMock.settings['enableTax'].value, false, "Disable tax")
	simplePos.toggleEnableTax();
	assert.equal(dbMock.settings['enableTax'].value, true, "Disable tax")
})

QUnit.test("Toggle Tax Inclusive", function(assert){
	simplePos.reset();
	simplePos.toggleTaxInclusive();
	assert.equal(dbMock.settings['taxInclusive'].value, false, "Tax inclusive")

	simplePos.toggleTaxInclusive();
	assert.equal(dbMock.settings['taxInclusive'].value, true, "Tax inclusive")
})


QUnit.test("Toggle Single Tax", function(assert){
	simplePos.reset();
	simplePos.toggleSingleTax();
	assert.equal(dbMock.settings['singleTax'].value, false, "Single tax")
	simplePos.toggleSingleTax();
	assert.equal(dbMock.settings['singleTax'].value, true, "Single tax")
})

QUnit.test("Set Line Discount", function(assert){
  simplePos.reset();
  simplePos.addToInvoice(1) 
  simplePos.addToInvoice(1) 
  var line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  simplePos.setDiscount(line, '5%')
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal(line.discount, '5%', "Discount should be 5%")
  assert.equal(line.discount_amount, 25, "Discount amount should be 25")
})

QUnit.test("Compute Taxable Sales", function(assert){
  simplePos.reset();
  var tax_inclusive = true
  var retail_price = 250
  var quantity = 2
  var discount_amount = 25 
  var tax_rate = "12%"
  var taxable_sale_inclusive = simplePos.computeTaxableSale(retail_price, quantity, discount_amount, tax_rate, tax_inclusive);
  assert.equal(taxable_sale_inclusive.toFixed(2), 424.11, "Taxable sales (Tax inclusive)")

  var tax_inclusive = false
  var taxable_sale_exclusive = simplePos.computeTaxableSale(retail_price, quantity, discount_amount, tax_rate, tax_inclusive);
  assert.equal(taxable_sale_exclusive.toFixed(2), 475, "Taxable sales (Tax exclusive)")  
})

QUnit.test("Compute Tax", function(assert){
  simplePos.reset();
  var taxable_sales = 475
  var tax_rate = "12%"
  var tax  = simplePos.computeTax(taxable_sales, tax_rate)
  assert.equal(tax, 57)
})

QUnit.test("Set Line Tax", function(assert){
  simplePos.reset();
  simplePos.addToInvoice(1) 
  simplePos.addToInvoice(1)
  var line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  simplePos.setDiscount(line, '5%')
  dbMock.settings['taxInclusive'].value = true
  simplePos.setTax(line)
  assert.equal(line.tax_amount, 50.89, "Line tax amount (Inclusive)")

  dbMock.settings['taxInclusive'].value = false
  simplePos.setTax(line)
  assert.equal(line.tax_amount, 57, "Line tax amount (Exclusive)")  
})

QUnit.test("Set Line Subtotal", function(assert){
  simplePos.reset();
  simplePos.addToInvoice(1) 
  simplePos.addToInvoice(1)
  var line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  simplePos.setDiscount(line, '5%')
  dbMock.settings['taxInclusive'].value = false
  simplePos.setTax(line)
  simplePos.setLineSubtotal(line)
  assert.equal(line.subtotal, 532 , "Line subtotal (tax exclusive)")

  dbMock.settings['taxInclusive'].value = true
  simplePos.setTax(line)
  simplePos.setLineSubtotal(line)
  assert.equal(line.subtotal, 475, "Line subtotal (tax inclusive)")
})


function createInvoice(){
  simplePos.resetInvoice();
  simplePos.addToInvoice(1) 
  simplePos.addToInvoice(1)
  simplePos.addToInvoice(2) 
  simplePos.addToInvoice(2)
  simplePos.addToInvoice(2) 
  simplePos.addToInvoice(3)
  simplePos.addToInvoice(4)
  simplePos.setCustomer(1)
}

QUnit.test("Set Invoice Subtotal", function(assert){
  createInvoice();
  dbMock.settings['taxInclusive'].value = true
  simplePos.setInvoiceSubtotal()
  var invoice = dbMock.openInvoice
  assert.equal(invoice.subtotal, 1306.25, "Invoice subtotal (tax inclusive)")

  dbMock.settings['taxInclusive'].value = false
  simplePos.setInvoiceSubtotal()
  assert.equal(invoice.subtotal, 1306.25, "Invoice subtotal (tax exclusive)")
})


QUnit.test("Set Invoice Discount", function(assert){
  createInvoice();
  dbMock.settings['taxInclusive'].value = true
  simplePos.setInvoiceDiscount()
  var invoice = dbMock.openInvoice 
  assert.equal(invoice.discount_amount, 68.75, "Invoice Total Discount (tax inclusive)")

  dbMock.settings['taxInclusive'].value = false
  simplePos.setInvoiceDiscount()
  assert.equal(invoice.discount_amount, 68.75, "Invoice Total Discount (tax exclusive)")

})

QUnit.test("Set Invoice Total Tax", function(assert){
  createInvoice();
  dbMock.settings['taxInclusive'].value = true
  var invoice = dbMock.openInvoice
  var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
  invoiceLines.forEach(function(line){
    simplePos.setTax(line)
  });
  simplePos.setInvoiceTotalTax()
  assert.equal(invoice.total_tax, 109.42, "Invoice Total Tax (tax inclusive)")


  dbMock.settings['taxInclusive'].value = false
  var invoice = dbMock.openInvoice
  var invoiceLines = Object.values(dbMock.openInvoice.invoiceLines)
  invoiceLines.forEach(function(line){
    simplePos.setTax(line)
  });
  simplePos.setInvoiceTotalTax()
  assert.equal(invoice.total_tax, 122.55, "Invoice Total Tax (tax exclusive)")
})


QUnit.test("Set Invoice Amount Due", function(assert){
  dbMock.settings['taxInclusive'].value = true
  createInvoice();
  var invoice = dbMock.openInvoice
  assert.equal(invoice.amount, 1306.25, "Invoice Amount Due (tax inclusive)")

  dbMock.settings['taxInclusive'].value = false
  createInvoice();
  var invoice = dbMock.openInvoice
  assert.equal(invoice.amount, 1428.8, "Invoice Amount Due (tax exclusive)")
})
