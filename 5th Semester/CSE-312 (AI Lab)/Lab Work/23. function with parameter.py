def main():
    #function with parameter
    print("Main")
    def greet(name1,name2,name3,num):
          print(f"Hello, {name1}, {name2}, {name3}!. Welcome to python lecture {num}. ")
    
    a = "Mobarok"
    b = "Hossain"
    c = "Zobaer"
    
    greet(a, b, c, 3)
          
if __name__=='__main__':
        main()
    