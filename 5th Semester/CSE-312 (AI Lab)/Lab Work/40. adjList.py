

def user_adjList():
    adjList = {}
    nodes = int(input("Enter total Node: "))
    for i in range(nodes):
        node = input("Node: ") #node name
        while True:
           neighbour_node = input("Neighbour: ")
           if neighbour_node == "":
               break
           neighbour_path_cost = int(input("Cost: "))
           adjList[node] = [{neighbour_node:neighbour_path_cost }]
    
    print(adjList)
            
user_adjList()   


     
if __name__=='__main__':
        user_adjList()        
        