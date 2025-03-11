.model small
.stack 100h
.code

main proc       ;main procedude

MOV CL,65
PRINT:

MOV AH,2
MOV BL,CL
                ;ADD BL,48
MOV DL,BL
INT 21H

mov dl,10
int 21h
    
mov dl,13
int 21h  

INC CL

CMP CL,90
JLE PRINT


    
    
exit:


main endp      ;end the procedure
end main       ;end program