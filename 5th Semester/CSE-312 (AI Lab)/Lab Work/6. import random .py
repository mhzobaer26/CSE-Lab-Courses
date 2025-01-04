import random

#generate random probabilty between 0 and 1 (including 0)
def main():
   threshold = 0.80
   #get the probabilty
   probability = random.random()

   #determine if the square is a bomb
   is_bomb_square = probability > threshold

   print(probability)   
   print(is_bomb_square)        
    
          
if  __name__ == '__main__':
     main()         

