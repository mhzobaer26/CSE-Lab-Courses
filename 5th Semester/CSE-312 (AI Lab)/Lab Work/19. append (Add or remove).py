def main():
    colors = []
    var = input("Enter your Color name:")
    
    while var!="Black":
          colors.append(var)
          var=input()
          
    print(colors)
    
    rv = input("Enter your Color name for Removing:")
    
    if rv in colors:
          colors.remove(rv)
          
    print(colors)
    
if __name__ == '__main__':
    main()      