QUnit.test( "Add Product To Invoice", function( assert ) {
  simplePos.resetInvoice();
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
  simplePos.resetInvoice();
  simplePos.setCustomer(1)
  assert.equal( simplePos.openInvoice.customer.id, 1, "Invoice customer")

  simplePos.addToInvoice(1) 
  line = simplePos.openInvoice.invoiceLines['Nintendo Switch']
  assert.equal(line.discount, '5%', "Customer discount")
})


