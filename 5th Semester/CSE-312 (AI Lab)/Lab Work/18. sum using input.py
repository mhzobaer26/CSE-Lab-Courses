def main():
    #function with two parameter
    def add(a,b):
        return a+b
    
    a = int(input("Enter your first number:"))
    b = int(input("Enter your second number:"))
    result = add(a,b)
    
    print("Summation: ", result)
    
if __name__=='__main__':
        main()
    
    