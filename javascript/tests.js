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

})

QUnit.test("Compute Taxable Sales", function(assert){

})

QUnit.test("Compute Tax", function(assert){

})

QUnit.test("Set Line Tax", function(assert){

})

QUnit.test("Set Line Subtotal", function(assert){

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

})


QUnit.test("Set Invoice Discount", function(assert){

})

QUnit.test("Set Invoice Total Tax", function(assert){

})


QUnit.test("Set Invoice Amount Due", function(assert){

})
