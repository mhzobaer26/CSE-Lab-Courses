#include<bits/stdc++.h>
using namespace std;

void calculator(string str) {

    char op = str[2];


    int num1 = stoi(str.substr(0, 2));
    int num2 = stoi(str.substr(3, 2));

    if(op == '+') {
        cout << num1 + num2 << endl;
    }
    else if(op == '-') {
        cout << num1 - num2 << endl;
    }
    else if(op == '*') {
        cout << num1 * num2 << endl;
    }
    else if(op == '/') {
        if(num2 != 0) {
            cout << num1 / num2 << endl;
        } else {
            cout << "Error: Division by zero!" << endl;
        }
    }
}

int main() {
    string str;

    while(true) {
        cout << "Enter a 2-digit calculation: ";
        cin >> str;

        if (str == "exit") {
            break;
        }


        calculator(str);
    }

    return 0;
}
