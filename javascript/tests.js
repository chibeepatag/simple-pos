QUnit.test( "Add Product To Invoice", function( assert ) {
  simplePos.resetInvoice();
  simplePos.addToInvoice(1)
  result = simplePos.openInvoice.invoiceLines.find(function(line){
  	return line.product.id == 1
  })
  assert.ok( result.product.id == 1, "Passed!" );
  assert.ok( simplePos.openInvoice.invoiceLines.length == 1, "Passed!" );
  simplePos.addToInvoice(2)
  assert.ok( simplePos.openInvoice.invoiceLines.length == 2, "Passed!" );
});


