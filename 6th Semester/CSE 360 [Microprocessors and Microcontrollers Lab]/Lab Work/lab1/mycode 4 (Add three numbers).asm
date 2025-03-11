.model small
.stack 100h
.code

main proc       ;main procedude
    
    mov ah,1    ;take input
    int 21h     ;call intarrupt
    mov bl,al   ;move the value to lower base register
    mov ah,2    ;display output
    
    mov dl,32   ;display space
    int 21h     ;call intarrupt
    
    mov ah,1    ;take input
    int 21h     ;call intarrupt
    mov bh,al   ;move the value to higher base register
    mov ah,2    ;display output
    
    
    
    add bl,bh   ;add both value
    sub bl,48   ;hence every input take 48 extra character so we should substract this value
    
    
    
    mov dl,32   ;display space
    int 21h     ;call intarrupt
    
    mov ah,1    ;take input
    int 21h     ;call intarrupt
    mov cl,al   ;move the value to higher base register
    mov ah,2    ;display output
    
    
    
    add cl,bl   ;add both value
    sub cl,48   ;hence every input take 48 extra character so we should substract this value
    
    
    
    mov dl,10   ;new line
    int 21h     ;call intarrupt
    
    mov dl,13   ;left shift /carriage return
    int 21h     ;call intarrupt
    
    
    
    mov dl,cl   ;place the value to display register
    int 21h     ;call intarrupt
    
    

exit:


main endp      ;end the procedure
end main       ;end program