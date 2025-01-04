import numpy as np

# Step 1: Create 7x24 array with random temperatures between -5°C to 30°C
temperatures = np.random.randint(-5, 30, (7, 24))

# Step 2: Calculate the average temperature for each day
avg_temp_per_day = np.mean(temperatures, axis=1)

# Step 3: Calculate max and min temperature for each day
max_temp_per_day = np.max(temperatures, axis=1)
min_temp_per_day = np.min(temperatures, axis=1)

# Step 4: Find total number of hours in the week when temp is below 0°C
below_zero_hours = np.sum(temperatures < 0)

# Step 5: Calculate the overall temperature of the week (mean of all temps)
overall_avg_temp = np.mean(temperatures)

# Display the results
print("Here are the Array\n",temperatures)
print("Average temperature per day:", avg_temp_per_day)
print("Maximum temperature per day:", max_temp_per_day)
print("Minimum temperature per day:", min_temp_per_day)
print("Total number of hours below 0°C:", below_zero_hours)
print("Overall average temperature of the week:", overall_avg_temp)


'''
import numpy as np
import random

def main():
  
#Task 01
   array = np.random.randint(-5,30,size=(7,24))
   
   print("Here the Array\n",array)

#Task 02
   mean = np.mean(array,axis=1)              #row wise and (axis =0 coloumn wise)
   print("Here the Avarage value:\n",mean)
         
#Task 03
   low = np.min(array,axis=1)
   print("Here the Minimum",low)
   
   high = np.max(array,axis=1)
   print("Here the maximum",high)
   
 #Task 04
   totalcnt = np.count_nonzero(array)
   total = 7 * 24
   result = total - totalcnt
   print("Total Count Number ", result)
   
#Task 05
   overallavgTemp = np.mean(array)
   print("Here the Overall average Temperature:", overallavgTemp)
   
#Task 06
   minimum = np.argmin(array, axis = 1)
   print("Coldest Hour: ",minimum)
   
   maximum = np.argmax(array, axis = 1)
   print("Hottest Hour: ",maximum)
    
    
if __name__ == '__main__':
    main()
'''
