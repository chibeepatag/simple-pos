Test Driven Development
1. Setting the expectations
2. What is  TDD? Why is TDD important?
3. The Red Green Refactor Cycle
4. How to implement TDD
5. Invoice Tax Computation Scenarios
6. Implementing TDD using Javascipt
7. Exercise
8. Implementing TDD using Rails

Training duration: 3 hours

https://www.codecademy.com/articles/tdd-red-green-refactor
https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3

-----------------------------------------------------------------------------------------------------------------------

1. Setting the expectations
	Hello, what programming language are you using? 
	What project are you currently using?
	How do you test your code?

	This lecture is about the concept of TDD and not how to use a specific TDD library. I will use javascript and QUnit 
	for my examples and exercises but the concepts learned here are applicable to any programming language.

2. What is Test Driven Development
	an approach to software development where you write tests first, then use those tests to drive the design and development of your software application.
	Unit tests check blocks of code to ensure that they all run as expected. 
  
   Snapshot of TDD
   Why is TDD important? Where is it used?
   Continuous integration - routinely push/commit into the main branch of a repository, and testing the changes, as early and often as possible. 
   Automated tests
  

3. The Red Green Refactor Cycle
	Red - write a test on what you are about to implement (as it it has been implemented)
	Green - write the code
	Refactor - clean up!
	           remove duplication




How to compute tax of invoice line
1. Compute discount
2. Is the customer tax exempt? Is the product tax exempt?
3. Compute Tax 
	Single Tax
	Multiple Tax
		Store wide taxes
		Product specific taxes
4. Compute line subtotal and subtotal without tax
5. Update invoice
6. Update totals view