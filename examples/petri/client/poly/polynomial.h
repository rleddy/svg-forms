// FILE: polynomial.h
// CLASS PROVIDED:
//   class polynomial (in the namespace main_savitch_3)
//     A polynomial has one variable x, real number coefficients, and
//     non-negative integer exponents. Such a polynomial can be viewed
//     as having the form:
//       A[n]*x^n + A[n-1]*x^(n-1) + ... A[2]*x^2 + A[1]*x + A[0]
//     where the A[n] are the real number coefficients and x^i represents
//     the variable x raised to the i power. The coefficient A[0] is
//     called the "constant" or "zeroth" term of the polynomial.
//
// NOTES TO STUDENT:
//   1. This version works by storing the coefficients in
//      a fixed array. The coefficient for the x^k term is stored
//      in location [k] of the fixed-size array. Later we will modify
//      the implementation to use a dynamic array.
//   2. Note that two functions have been implemented as inline functions
//      in this file (the degree and operator() functions).
//   3. An implementation of the make_gif function is available for
//      students to use at www.cs.colorado.edu/~main/projects/polygif.cxx.
//
// MEMBER CONSTANTS
//   const static size_t CAPACITY
//     The size of the fixed array to store the coefficients.
//   const static size_t MAX_EX = CAPACITY - 1;
//     The maximum exponent permitted.
//
// CONSTRUCTOR for the polynomial class
//   polynomial(double c = 0.0, unsigned int exponent = 0)
//     PRECONDITION: exponent <= MAX_EX.
//     POSTCONDITION: This polynomial has been create with all zero
//     coefficients, except for coefficient c for the specified exponent.
//     When used as a default constructor (using default values for
//     both arguments), the result is a polynomial with all zero
//     coefficients.
//
// MODIFICATION MEMBER FUNCTIONS for the polynomial class
//   void add_to_coef(double amount, unsigned int exponent)
//     PRECONDITION: exponent <= MAX_EX.
//     POSTCONDITION: Adds the given amount to the coefficient of the
//     specified exponent.
//
//   void assign_coef(double coefficient, unsigned int exponent)
//     PRECONDITION: exponent <= MAX_EX.
//     POSTCONDITION: Sets the coefficient for the specified exponent.
//
//   void clear( )
//     POSTCONDITION: All coefficients of this polynomial are set to zero.
//
// CONSTANT MEMBER FUNCTIONS for the polynomial class
//   double coefficient(unsigned int exponent) const
//     POSTCONDITION: Returns coefficient at specified exponent of this
//     polynomial.
//     NOTE: for exponents > MAX_EX, the return value is always zero.
//
//   unsigned int degree( ) const
//     POSTCONDITION: The function returns the value of the largest exponent
//     with a non-zero coefficient.
//     If all coefficients are zero, then the function returns zero.
//
//   polynomial derivative( ) const
//     POSTCONDITION: The return value is the first derivative of this
//     polynomial.
//
//   double eval(double x) const
//     POSTCONDITION: The return value is the value of this polynomial with the
//     given value for the variable x.
//
//   unsigned int next_term(unsigned int e) const
//     POSTCONDITION: The return value is the next exponent n which is LARGER
//     than e such that coefficient(n) != 0.
//     If there is no such term, then the return value is zero.
//
//   unsigned int previous_term(unsigned int e) const
//     POSTCONDITION: The return value is the next exponent n which is SMALLER
//     than e such that coefficient(n) != 0.
//     If there is no such term, then the return value is UINT_MAX
//     from <climits>.
//
// CONSTANT OPERATORS for the polynomial class
//   double operator( ) (double x) const
//     Same as the eval member function.
//
// NON-MEMBER BINARY OPERATORS for the polynomial Class
//   polynomial operator -(const polynomial& p1, const polynomial& p2)
//     POSTCONDITION: return-value is a polynomial with each coefficient
//     equal to the difference of the coefficients of p1 & p2 for any given
//     exponent.
//
//   polynomial operator =(const polynomial& p1, const polynomial& p2)
//     POSTCONDITION: return-value is a polynomial with each coefficient
//     equal to the coefficients of p1 & p2 for any given
//     exponent.
//
//   polynomial operator +(const polynomial& p1, const polynomial& p2)
//     POSTCONDITION: return-value is a polynomial with each coefficient
//     equal to the sum of the coefficients of p1 & p2 for any given
//     exponent.
//
//   polynomial operator *(const polynomial& p1, const polynomial& p2)
//     PRECONDITION: p1.degree( ) + p2.degree( ) <= polynomial::MAX_EX.
//     POSTCONDITION: Each term of p1 has been multiplied by each term of p2,
//     and the answer is the sum of all these term-by-term products.
//     For example, if p1 is 2x^2 + 3x + 4 and p2 is 5x^2 - 1x + 7, then the
//     return value is 10x^4 + 13x^3 + 31x^2 + 17x + 28.
//
// NON-MEMBER OUTPUT FUNCTIONS for the polynomial Class
//   ostream& operator << (ostream& out, const polynomial& p)
//     POSTCONDITION: The polynomial has been printed to ostream out, which,
//     in turn, has been returned to the calling function.
//
//   void make_gif(
//     const polynomial& p,
//     const char filename[ ],
//     double low_x,
//     double high_x,
//     double low_y,
//     double high_y
//     )
//     PRECONDITION: filename is a legal filename for a gif file.
//     Also (low_x < high_x) && (low_y < high_y).
//     POSTCONDITION: A gif file has been written to the specified filename
//     with a graphical representation of the polynomial in the specified
//     ranges (low_x...high_x and low_y...high_y).

#ifndef POLYNOMIAL_H
#define POLYNOMIAL_H
#include <iostream> // Provides ostream

// If your compiler does not support namespaces, then please delete the
// following line and the set of brackets that follow.
namespace main_savitch_3
{

class polynomial
{
public:
    // CONSTANTS
    static const unsigned int CAPACITY = 30;
    static const unsigned int MAX_EX = CAPACITY - 1;

    // CONSTRUCTOR
    polynomial();
    polynomial(const polynomial& source);
    ~polynomial();

        // MODIFICATION MEMBER FUNCTIONS
    void add_to_coef(double amount, unsigned int a);
    void assign_coef(double new_coef, unsigned int a);
    void clear();
    void reserve(unsigned int new_capacity);
    
    // CONSTANT MEMBER FUNCTIONS
    double coefficient(unsigned int a) const;
    unsigned int degree( ) const { return current_degree; }
 
    // polynomial derivative( ) const;
    double eval(double x) const;
    unsigned int next_term(unsigned int e) const;
    unsigned int previous_term(unsigned int e) const;

    // CONSTANT OPERATORS
    double operator( ) (double x) const { return eval(x); }

    void operator=(const polynomial& source);
    
private:
	
    double *coef;
    unsigned int current_degree;
    

    void compute_degree();
};

// NON-MEMBER BINARY OPERATORS
polynomial operator+(const polynomial& p1, const polynomial& p2);
polynomial operator-(const polynomial& p1, const polynomial& p2);



//polynomial operator *(const polynomial& p1, const polynomial& p2);

    // NON-MEMBER OUTPUT FUNCTIONS
std::ostream& operator<<(std::ostream& out, const polynomial& p);
}
#endif
