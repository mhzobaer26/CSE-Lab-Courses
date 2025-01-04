import random

def main():
    random.seed(1)
    print(random.randint(0, 100))
    
    random.seed(1)
    print(random.randint(0, 100))     
    
    random.seed(0) #different seed gives different number
    print(random.randint(0, 100))
    
if  __name__ == '__main__':
        main()
            
