# -*- coding: utf-8 -*-
"""
Created on Thu Nov 14 12:19:21 2024

@author: Lab-41117
"""

def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()  
    
    visited.add(node)
    print(node, end=" ")
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)  


graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

dfs(graph, 'A')  
