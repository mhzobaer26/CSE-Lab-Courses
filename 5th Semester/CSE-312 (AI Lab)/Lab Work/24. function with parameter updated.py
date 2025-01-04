def main():
    #function with parameter (using default)
    print("Main")
    def greet(name1="Default",name2="Default",name3="Default",num=0):
        print(f"Hello, {name1}, {name2}, {name3}!. Welcome to python lecture {num}. ")
        
    a = "Hasan"  
    b = "zawad"
    c = "sadia"

    greet(a)
    

if __name__=='__main__':
        main()
    