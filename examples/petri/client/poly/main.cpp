// FILE: polyexam0.cxx
// Written by: Michael Main (main@colorado.edu), Sep 8, 2000
// Non-interactive test program for the polynomial class
// from http://www.cs.colorado.edu/~main/chapter3/poly0.cxx

#include <climits>   // Provides UINT_MAX
#include <cmath>     // Provides fabs
#include <cstdlib>   // Provides rand
#include <cstring>   // Provides memcpy
#include <iostream>  // Provides cout
#include "polynomial.h"

using namespace std;
using namespace main_savitch_3;
const unsigned int TESTSIZE = 5;

// Descriptions and points for each of the tests:
const size_t MANY_TESTS = 8;
const int POINTS[MANY_TESTS + 1] = {
	//60, // Total points for all tests.
	50, // we're skipping two tests here CBS
	25, // Test 1 points
	5,  // Test 2 points
	5,  // Test 3 points
	5,  // Test 4 points
	5,  // Test 5 points
	5,  // Test 6 points
	5,  // Test 7 points
	5   // Test 8 points
};

const char DESCRIPTION[MANY_TESTS + 1][256] = {
	"tests for polynomial class",
	"Testing basic functions",
	"Testing derivative function",
	"Testing eval and operator ( )",
	"Testing next_term and previous_term function",
	"Testing operator +",
	"Testing operator -",
	"Testing operator *",
	"Testing operator <<"
};


// **************************************************************************
// bool close(double a, double b)
//   Returns true if a is within EPSILON of b.
// **************************************************************************
bool close(double a, double b) {
	const double EPSILON = 0.0001;
	
	return (fabs(a - b) < EPSILON) || (fabs(1 - a / b) < EPSILON);
}

// **************************************************************************
// bool correct(const polynomial& test, unsigned int d, double c[ ])
//   This function determines if the polynomial (test) is "correct" according
//   to these requirements:
//   a. it's degree is d
//   b. For each i in the range 0...(degree), test.coefficient(i) is c[i].
// **************************************************************************
bool correct(const polynomial &test, unsigned int d, double count[]) {
	size_t i;
	bool answer = true;
	if (test.degree() != d) {
		cout << "Incorrect degree. " << endl;
		answer = false;
	}
	else {
		for (i = 0; i <= d; ++i) {
			if (!close(count[i], test.coefficient(i))) {
				cout << "Incorrect coefficient(" << i << ")" << endl;
				answer = false;
			}
		}
		for (i = d + 1; i <= polynomial::MAX_EX * 2; ++i) {
			if (!close(test.coefficient(i), 0)) {
				cout << "Incorrect-coefficient(" << i << ")" << endl;
				answer = false;
			}
		}
		cout << (answer ? "Test passed.\n" : "Test failed.\n") << endl;
	}
	return answer;
}

double test1() {
	polynomial empty, x_squared(1.0, 2), p, also_empty(0.0, 3);;
	double c[8] = {0, 0, 0, 0, 0, 0, 0, 0};
	double rand_c[polynomial::CAPACITY];
	size_t i;
	
	cout << "I will now test the default constructor. After initializing\n"
	<< "with the default constructor, a the coefficient member\n"
	<< "function should always return zero (even beyond MAX_EX)."
	<< endl;
	if (!correct(empty, 0, c)) return 0;
	
	cout << "I will now test the constructor with arguments." << endl;
	c[2] = 1.0;
	if (!correct(x_squared, 2, c)) return 0;
	
	cout << "I will now test constructor like this: polynomial p(0.0, 3).\n"
	<< "After initializing this way, a polynomial\n"
	<< "should have all zero coefficients (even beyond MAX_EX)."
	<< endl;
	if (!correct(also_empty, 0, c)) return 0;
	
	cout << "I will now test assign_coef." << endl;
	p.assign_coef(1.0, 2);
	if (!correct(p, 2, c)) return 0;
	
	cout << "I will now test add_to_coef." << endl;
	p.add_to_coef(2.0, 2);
	c[2] += 2.0;
	if (!correct(p, 2, c)) return 0;
	
	cout << "Checking that add_to_coef correctly adjusts degree downward." << endl;
	p.assign_coef(1.0, 10);
	p.add_to_coef(-p.coefficient(10), 10);
	if (!correct(p, 2, c)) return 0;
	
	cout << "Checking that assign_coef correctly adjusts degree downward." << endl;
	p.assign_coef(1.0, 10);
	p.assign_coef(0, 10);
	if (!correct(p, 2, c)) return 0;
	
	cout << "I will now test the clear function." << endl;
	p.clear();
	c[2] = 0.0;
	if (!correct(p, 0, c)) return 0;
	
	cout << "Inserting " << polynomial::CAPACITY << " random coefficients\n";
	cout << "   and then checking the basic functions.";
	cout << endl;
	for (i = 0; i < polynomial::CAPACITY; i++) {
		rand_c[i] = ((rand() % 1000) / 100.0) + 1;
		p.assign_coef(rand_c[i], i);
	}
	if (!correct(p, polynomial::MAX_EX, rand_c)) return 0;
	
	return POINTS[1];
}


// Test derivative function
//double test2( )
//{
//    polynomial p;
//    double c[TESTSIZE];
//    unsigned int i;
//
//    cout << "Testing derivative." << endl;
//    p.assign_coef(((rand( ) % 1000)/100.0), 0);
//    for (i = 1; i <= TESTSIZE; ++i)
//    {
//	p.assign_coef(((rand( ) % 1000)/100.0), i);
//	c[i-1] = i * p.coefficient(i);
//    }
//    p.assign_coef(0.0, TESTSIZE/2);
//    c[(TESTSIZE/2)-1] = 0.0;
//    if (!correct(p.derivative( ), TESTSIZE-1, c)) return 0;
//
//    return POINTS[2];
//}

// Testing eval
double test3() {
	polynomial p;
	double value = 0.0;
	double power_of_x = 1.0;
	unsigned int i;
	const double X = 3.0;
	double c;
	
	cout << "Testing eval and operator ( )." << endl;
	for (i = 0; i < TESTSIZE; ++i) {
		c = ((rand() % 1000) / 100.0);
		if (i == TESTSIZE / 2) c = 0.0;
		p.assign_coef(c, i);
		value += c * power_of_x;
		power_of_x *= X;
	}
	if (!close(p.eval(X), value)) return 0;
	if (!close(p(X), value)) return 0;
	
	return POINTS[3];
}

// Test next_term function
double test4() {
	polynomial p;
	unsigned int i;
	
	for (i = 0; i <= TESTSIZE; ++i) {
		p.assign_coef(((rand() % 1000) / 100.0) + 1, i);
	}
	p.assign_coef(0.0, TESTSIZE / 2);
	
	cout << "Testing next_term function." << endl;
	for (i = 0; i < TESTSIZE; ++i) {
		if ((i != (TESTSIZE / 2) - 1) && (p.next_term(i) != i + 1))
		return 0;
	}
	if (p.next_term((TESTSIZE / 2) - 1) != (TESTSIZE / 2) + 1)
	return 0;
	for (i = TESTSIZE; i < 2 * polynomial::MAX_EX; ++i) {
		if (p.next_term(i) != 0)
		return 0;
	}
	cout << "Next Term Function is okay." << endl;
	
	cout << "Testing previous_term function." << endl;
	for (i = 1; i <= TESTSIZE; ++i) {
		if ((i != (TESTSIZE / 2) + 1) && (p.previous_term(i) != i - 1))
		return 0;
	}
	cout << "First for" << endl;
	if (p.previous_term((TESTSIZE / 2) + 1) != (TESTSIZE / 2) - 1)
	return 0;
	cout << "0 term skipped" << endl;
	for (i = TESTSIZE + 1; i < 2 * polynomial::MAX_EX; ++i) {
		if (p.previous_term(i) != TESTSIZE)
		return 0;
	}
	cout << "Second for" << endl;
	p.assign_coef(0, 0);
	if (p.previous_term(1) != UINT_MAX)
	return 0;
	cout << "run off bottom" << endl;
	cout << "Testing previous_term(0)" << endl;
	if (p.previous_term(0) != UINT_MAX)
	return 0;
	
	return POINTS[4];
}

// Test operator + function
double test5() {
	polynomial p, q;
	double c[TESTSIZE + 1];
	unsigned int i;
	
	cout << "Testing operator +" << endl;
	for (i = 0; i < TESTSIZE; ++i) {
		p.assign_coef(((rand() % 1000) / 100.0), i);
		q.assign_coef(((rand() % 1000) / 100.0), i);
		c[i] = p.coefficient(i) + q.coefficient(i);
	}
	p.assign_coef(((rand() % 1000) / 100.0) + 1, TESTSIZE);
	c[5] = p.coefficient(TESTSIZE);
	
	if (!correct(p + q, TESTSIZE, c)) return 0;
	
	return POINTS[5];
}

// Test operator - function
double test6() {
	polynomial p, q;
	double c[TESTSIZE + 1];
	unsigned int i;
	
	cout << "Testing operator -" << endl;
	for (i = 0; i < TESTSIZE; ++i) {
		p.assign_coef(((rand() % 1000) / 100.0), i);
		q.assign_coef(((rand() % 1000) / 100.0), i);
		c[i] = p.coefficient(i) - q.coefficient(i);
	}
	p.assign_coef(((rand() % 1000) / 100.0) + 1, TESTSIZE);
	c[5] = p.coefficient(TESTSIZE);
	
	if (!correct(p - q, TESTSIZE, c)) return 0;
	
	return POINTS[6];
}

// Test operator * function
//double test7( )
//{
//    polynomial p, q;
//    double c[2*TESTSIZE + 1];
//    unsigned int i,j;
//
//    cout << "Testing operator *" << endl;
//    for (i = 0; i < TESTSIZE; ++i)
//    {
//	p.assign_coef(((rand( ) % 1000)/100.0), i);
//	q.assign_coef(((rand( ) % 1000)/100.0), i);
//    }
//    p.assign_coef(((rand( ) % 1000)/100.0)+1, TESTSIZE);
//    q.assign_coef(((rand( ) % 1000)/100.0)+1, TESTSIZE);
//
//    for (i = 0; i <= 2 * TESTSIZE; ++i)
//	c[i] = 0.0;
//
//    for (i = 0; i <= TESTSIZE; ++i)
//	for (j = 0; j <= TESTSIZE; ++j)
//	    c[i+j] += p.coefficient(i) * q.coefficient(j);
//
//    if (!correct(p*q, 2*TESTSIZE, c)) return 0;
//
//    return POINTS[7];
//}

// Write a polynomial to cout for visual inspection
double test8() {
	polynomial p;
	
	p.assign_coef(-5.5, 5);
	p.assign_coef(+3.3, 3);
	p.assign_coef(-2.2, 2);
	p.assign_coef(1.1, 1);
	p.assign_coef(10.0, 0);
	
	cout << "Printing a polynomial for visual inspection by the TA: \n"
	<< p
	<< endl;
	
	return POINTS[8];
}

double run_a_test(int number, const char message[], double test_function(), int max) {
	double result;
	
	cout << endl << "START OF TEST " << number << ":" << endl;
	cout << message << " (" << max << " points)." << endl;
	result = test_function();
	if (result > 0) {
		cout << "Test " << number << " got " << result << " points";
		cout << " out of a possible " << max << "." << endl;
	}
	else
	cout << "Test " << number << " failed." << endl;
	cout << "END OF TEST " << number << "." << endl << endl;
	
	return result;
}


// **************************************************************************
// int main( )
//   The main program calls all tests and prints the sum of all points
//   earned from the tests.
// **************************************************************************
int main() {
	double sum = 0;
	
	cout << "Running " << DESCRIPTION[0] << endl;
	
	sum += run_a_test(1, DESCRIPTION[1], test1, POINTS[1]);
	//    sum += run_a_test(2, DESCRIPTION[2], test2, POINTS[2]);
	sum += run_a_test(3, DESCRIPTION[3], test3, POINTS[3]);
	sum += run_a_test(4, DESCRIPTION[4], test4, POINTS[4]);
	sum += run_a_test(5, DESCRIPTION[5], test5, POINTS[5]);
	sum += run_a_test(6, DESCRIPTION[6], test6, POINTS[6]);
	//    sum += run_a_test(7, DESCRIPTION[7], test7, POINTS[7]);
	sum += run_a_test(8, DESCRIPTION[8], test8, POINTS[8]);
	
	cout << "If you submit this to HAL now, you will have\n";
	cout << sum << " points out of the ";
	cout << POINTS[0];
	cout << " points from this test program.\n";
	
	return EXIT_SUCCESS;
	
}
