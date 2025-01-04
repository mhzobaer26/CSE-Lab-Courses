"""
Uninformed search = Blind search, Brute force Technique -> Optimal
Inform search = Heuristic search                        -> May Not optimal
Tree Traverse = i. Level Wise
               ii. Maintain order -> i. Post order (Left->Right->Root)
                                    ii. In order (Left->Root->Right)
                                   iii. Pre order (Root->left->right)
                                   
BFS
DFS

"""

from collections import deque

def bfs(graph, start):
    visited = set()  
    queue = deque([start])  
    visited.add(start)
    
    while queue:
        node = queue.popleft()  
        print(node, end=" ")  
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)


graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

bfs(graph, 'A')  
