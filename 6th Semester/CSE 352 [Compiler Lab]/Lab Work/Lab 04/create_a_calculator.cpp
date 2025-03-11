#include<bits/stdc++.h>
using namespace std;

void calculator (string s)
{

    if(s[1] == '+') cout<<(s[0] - '0')+(s[2] - '0')<<endl;
    else if(s[1] == '-') cout<<(s[0] - '0')-(s[2] - '0')<<endl;
    else if(s[1] == '*') cout<<(s[0] - '0')*(s[2] - '0')<<endl;
    else if(s[1] == '/') cout<<(s[0] - '0')/(s[2] - '0')<<endl;
}

int main()
{

    string str;

    cin>>str;

    calculator(str);
}
