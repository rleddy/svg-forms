#include "polynomial.h"
#include <algorithm>
#include <assert.h>
#include <climits>
#include <cmath>
#include <cstdlib>
#include <iostream>




using namespace main_savitch_3;
using namespace std;

// CONSTRUCTORS
polynomial::polynomial()
{
    coef = new double[1];
    coef[0] = 0;
    current_degree = 0;
}

polynomial::polynomial(const polynomial& source)
// Library facilities used: algorithm for copy
{
    current_degree = source.current_degree;
    coef = new double[current_degree + 1];
    copy(source.coef, source.coef + current_degree, coef);
}

// DESTRUCTOR
polynomial::~polynomial()
{
    delete[] coef;
}

// MODIFICATION MEMBER FUNCTIONS
void polynomial::add_to_coef(double amount, unsigned int exponent)
// Library facilities used: assert
{
    assert(exponent <= polynomial::MAX_EX);
    if(exponent > current_degree) {
        reserve(exponent);
        coef[exponent] += amount;
    }
}
void polynomial::assign_coef(double coefficient, unsigned int exponent)
{
    assert(exponent <= polynomial::MAX_EX);
    if(exponent > current_degree) {
        reserve(exponent);
        coef[exponent] = coefficient;
    }
}
void polynomial::clear()
{
    current_degree = 0;                     // Set current degree to 0
    for(int i = 0; i < current_degree; i++) // Set coef to 0.
    {
        coef[i] = 0;
    }
    current_degree=0;
}

void polynomial::reserve(unsigned int new_capacity)
{
    double* larger_array;

    if(new_capacity == current_degree) {
        return;
    } else if(new_capacity < current_degree) {
        new_capacity = current_degree;
    } else {
        larger_array = new double[new_capacity];
        copy(coef, coef + current_degree, larger_array);
        delete[] coef;
        coef = larger_array;
        current_degree = new_capacity;
    }
}

// CONSTANT MEMBER FUNCTIONS
double polynomial::coefficient(unsigned int exponent) const
{
    assert(exponent < current_degree);
    return coef[exponent];
}

double polynomial::eval(double x) const
// Library facilities used: cmath
{
    double evaluation;
    for(int i = 0; i < current_degree; i++) {
        evaluation += pow(x, i) * coef[i];
    }
    return evaluation;
}

unsigned int polynomial::next_term(unsigned int e) const
{
    for(int i = e + 1; i < current_degree; i++) {
        if(coef[i] != 0) 
            return (unsigned int)coef[i];
            return UINT_MAX
    }
}

unsigned int polynomial::previous_term(unsigned int e) const
// Library facilities used: climits
{
    int i = 0;
    for(i = e - 1; i < current_degree; i--)

    {
        if(coef[i] != 0) {
            return (unsigned int)coef[i];
        } else {
            return UINT_MAX;
        }
    }
}

// ASSIGNMENT OPERATOR
void polynomial::operator=(const polynomial& source)
// Library facilities used: algorithm
{
    double* new_coef;

    // Check for possible self-assignment:
    if ( this == &source ) return;

    // If needed, allocate an array with a different size:
    if(current_degree != source.current_degree) {
        new_coef = new double[source.current_degree];
        delete[] coef;
        coef = new_coef;
        current_degree = source.current_degree;
    }
}

// NON-MEMBER BINARY OPERATORS
polynomial operator+(const polynomial& p1, const polynomial& p2)
{

    polynomial temp;
	unsigned int max_degree = 0;
	
    if(p1.degree() > p2.degree()) {
		max_degree = p1.degree()
    } else if(p2.degree() > p1.degree()) {
		max_degree = p1.degree()
    }
	
	temp.reserve(max_degree)
	for ( unsigned int i = 0; i < max_degree; i++ ) {
		double c1 = p1.coefficient(i);
		double c2 = p2.coefficient(i);
		
		temp.assign_coef(i,(c1 + c2));
	}
	
	return temp;
}

polynomial operator-(const polynomial& p1, const polynomial& p2)
{
    int result1;
    int result2;
    int answer;

    for(int i = 0; i < p1.degree(); i++) {
        result1 += p1.coefficient(i);
    }
    for(int i = 0; i < p2.degree(); i++) {
        result2 += p2.coefficient(i);
    }
    answer += result2 - result1;
    return answer;
}

std::ostream& operator<<(ostream& out, const polynomial& p)
{
    for( unsigned int i = p.degree(); i > 0; i--) {
		if ( p.coefficient(i) != 0.0 )
		 out << p.coefficient(i) << "x^" << i << " + ";
    }
	
	out << p.coefficient(i) << endl;
    return out;
}
