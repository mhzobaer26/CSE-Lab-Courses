def main():
#start with an empty dictionary
    car_info = {}
    
#Populate the dictionary with information about car
    car_info["year"] = 2004
    car_info["color"] = "Blue"
    car_info["Crashed?"] = False
    car_info["Kilometers"] = 41312
#print the the whole dictionary
    print("Initial Car Info")
    print(car_info)
    

#update the car information
    car_info["Kilometers"] += 100       #the car was driven an additinal 100km
    car_info["Crashed?"] = True         #The car has been in an accident
    
#print the updated dictionary
    print("Updated Car Info")
    print(car_info)
    
    
if __name__ == '__main__':
    main()        
        