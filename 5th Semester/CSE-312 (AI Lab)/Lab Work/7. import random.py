import random

def main():
    #generate random height between 1.0 and 3.0 (inclusive)
    height_in_meters = random.uniform(1.0, 3.0)
    height_in_meters = round(height_in_meters , 3)
    print('height:' + str(height_in_meters) + "m")
          
if  __name__ == '__main__':
     main()         

