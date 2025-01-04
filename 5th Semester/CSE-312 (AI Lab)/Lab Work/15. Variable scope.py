def main():
    global_variable = 34
    
    def fun1():
        local_variable1= 56
        print(f"Summation of global and local variable {global_variable + local_variable1}")
         
    fun1()    
    
        
        
if __name__=='__main__':
        main()        