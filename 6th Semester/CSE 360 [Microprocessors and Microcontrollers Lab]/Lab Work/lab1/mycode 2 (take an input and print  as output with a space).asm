.model small
.stack 100h
.code

main proc       ;main procedude
    
    mov ah,1    ;take input
    int 21h     ;call intarrupt
    mov bl,al   ;move the value to base lower register
    mov ah,2    ;display output 
    
    mov dl,32   ;display space 
    int 21h     ;call intarrupt
    
    mov ah,1    ;take input
    int 21h     ;call intarrupt
    mov bh,al   ;move the value to base higher register
    mov ah,2    ;display output
       
       
    mov dl,10   ;new line
    int 21h     ;call intarrupt
    
    mov dl,13   ;left shift /carriage return
    int 21h     ;call intarrupt
     
     
    
    mov dl,bl   ;place the 1st value to display register
    int 21h     ;call intarrupt
       
    mov dl,32   ;display space
    int 21h     ;call intarrupt
    
    mov dl,bh   ;place the 2nd value to display register
    int 21h     ;call intarrupt
    
    
    
    
    
exit:



main endp      ;end the procedure
end main       ;end program