import numpy as np
def main():
    arr = np.array([[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]])
    
    print(arr)
    print("Third element of the second array: ",arr[0, 1, 2])
if __name__ == '__main__':
    main()