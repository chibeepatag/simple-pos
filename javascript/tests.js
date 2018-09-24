QUnit.test( "Add Product To Invoice", function( assert ) {
  simplePos.reset();
  simplePos.addToInvoice(1) 
  line = simplePos.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.product.id, 1, "Line product" );
  assert.equal( line.quantity, 1, "Line quantity" );
  assert.equal( line.retail_price, line.product.retail_price, "Line retail price" );

  simplePos.addToInvoice(1)
  line = simplePos.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.quantity, 2, "Line quantity" );

  simplePos.addToInvoice(1)
  line = simplePos.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal( line.quantity, 3, "Line quantity" );
});

QUnit.test("Set Invoice Customer", function( assert ){
  simplePos.reset();
  simplePos.setCustomer(1)
  assert.equal( simplePos.openInvoice.customer.id, 1, "Invoice customer")

  simplePos.addToInvoice(1) 
  line = simplePos.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal(line.discount, '5%', "Customer discount")
})

QUnit.test("Toggle Tax", function(assert){
	simplePos.reset();
	simplePos.toggleEnableTax();
	assert.equal(simplePos.settings['enableTax'].value, false, "Disable tax")
	simplePos.toggleEnableTax();
	assert.equal(simplePos.settings['enableTax'].value, true, "Disable tax")
})

QUnit.test("Toggle Tax Inclusive", function(assert){
	simplePos.reset();
	simplePos.toggleTaxInclusive();
	assert.equal(simplePos.settings['taxInclusive'].value, false, "Tax inclusive")

	simplePos.toggleTaxInclusive();
	assert.equal(simplePos.settings['taxInclusive'].value, true, "Tax inclusive")
})


QUnit.test("Toggle Single Tax", function(assert){
	simplePos.reset();
	simplePos.toggleSingleTax();
	assert.equal(simplePos.settings['singleTax'].value, false, "Single tax")
	simplePos.toggleSingleTax();
	assert.equal(simplePos.settings['singleTax'].value, true, "Single tax")

})

