def main():
    def factorial(n):
        if n<=0:
            print("You input some nagateive number")
        if n == 1:
            return 1
        else:
            return n * factorial(n-1)
        
    num = int(input("Enter your number: "))
    
        
    ans = factorial(num)
    print(f"Factorial {ans}")
    
if __name__=='__main__':
        main()        