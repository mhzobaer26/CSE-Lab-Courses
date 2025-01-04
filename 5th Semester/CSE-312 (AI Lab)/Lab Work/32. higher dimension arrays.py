import numpy as np
def main():
    arr = np.array([1, 2, 3, 4], ndmin=5)

    print(arr)
    print('number of dimensions :', arr.ndim)

if __name__ == '__main__':
    main()