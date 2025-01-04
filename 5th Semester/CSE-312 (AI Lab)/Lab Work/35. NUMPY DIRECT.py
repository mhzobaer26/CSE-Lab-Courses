import numpy as np

def main():
    arr = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
    
    for x in np.nditer(arr):
      print(x)
      
if __name__ == '__main__':
    main()