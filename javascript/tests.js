QUnit.test( "Add Product To Invoice", function( assert ) {
  simplePos.reset();
  simplePos.addToInvoice(1) 
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.product.id, 1, "Line product" );
  assert.equal( line.quantity, 1, "Line quantity" );
  assert.equal( line.retail_price, line.product.retail_price, "Line retail price" );

  simplePos.addToInvoice(1)
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.quantity, 2, "Line quantity" );

  simplePos.addToInvoice(1)
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.quantity, 3, "Line quantity" );
});

QUnit.test("Set Invoice Customer", function( assert ){
  simplePos.reset();
  simplePos.setCustomer(1)
  assert.equal( dbMock.openInvoice.customer.id, 1, "Invoice customer")

  simplePos.addToInvoice(1) 
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal(line.discount, '5%', "Customer discount")
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

QUnit.test("Compute Line Discount", function(assert){
  simplePos.addToInvoice(1) 
  simplePos.addToInvoice(1) 
  simplePos.setDiscount('Nintendo Switch', '5%')
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal(line.discount, '5%', "Discount should be 5%")
  assert.equal(line.discount_amount, 25, "Discount amount should be 25")
})

QUnit.test("Compute Line Tax", function(assert){

})

QUnit.test("Compute Line Subtotal", function(assert){
  simplePos.addToInvoice(1) 
  simplePos.addToInvoice(1) 
  simplePos.setDiscount('Nintendo Switch', '5%')
  line = dbMock.openInvoice.invoiceLines['Nintendo Switch']
  simplePos.setSubtotal(line)
  assert.equal(line.subtotal, 475)
})


QUnit.test("Compute Invoice Subtotal", function(assert){

})

QUnit.test("Compute Invoice Discount", function(assert){

})

QUnit.test("Compute Invoice Total Tax", function(assert){

})

QUnit.test("Compute Invoice Amount Due", function(assert){

})