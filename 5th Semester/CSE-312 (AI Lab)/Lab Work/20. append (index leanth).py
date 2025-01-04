def main():
    colors = []
    var = input("Enter your Color name:")
    
    while var!="Black":
          colors.append(var)
          var=input()
          
    print(colors)
    
    idx = colors.index("red")
    print("Your Index is ", idx)
    
    idxlentgh = colors.length("red")
    print("Your Index is ", idxlentgh)

if __name__ == '__main__':
    main()      