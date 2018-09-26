Test Driven Development
1. Setting the expectations
2. What is  TDD? Why is TDD important?
3. The Red Green Refactor Cycle
4. Implement TDD with Simple POS
5. Exercise


Training duration: 2 hours

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
  
    Show Snapshot of TDD

   	Why is TDD important? Where is it used?
   	Continuous integration - routinely push/commit into the main branch of a repository, and testing the changes, as early and often as possible. 
   	Automated tests

3. The Red Green Refactor Cycle
	Red - write a test on what you are about to implement (as it it has been implemented)
	Green - write the code
	Refactor - clean up!
	           remove duplication

4. Lets implement TDD together with Simple POS
	Discount
	Tax Tax Exclusive

5. Exercise
	Complete Simple POS using TDD - Red, Green, Refactor Cycle

	clone the project: https://github.com/chibeepatag/simple-pos.git
	checkout the branch no_computations: 
		git pull origin no_computations
	Create your own branch
	    git checkout -b <your_name>

	Implement
	1. Computation of invoice summary (invoice subtotal, invoice total tax, invoice total discount, invoice amount due)
	2. Implement Tax Inclusive computations

	You may use this excel sheet as a reference for values.
	https://docs.google.com/spreadsheets/d/1He_R7STCiC7QaQD7TeGSeR3P9GO5zwV-jYkne2xOnbI/edit?usp=sharing


How to compute tax of invoice line
1. Compute discount
2. Is the product tax exempt?
3. Compute Tax 
	Single Tax
4. Compute line subtotal and subtotal without tax
5. Update invoice
6. Update totals view