def main():
    global_variable = 34
    
    def fun1():
        local_variable1= 56
        print(f"Summation of global and local variable {global_variable + local_variable1}")
        
#not access local_variable1
    def fun2():
        local_variable2= 11
        #print(f"Summation of local variables {local_variable1 + local_variable2}")    
        
    fun1()    
    fun2()
        
        
if __name__=='__main__':
        main()        