import networkx as nx
import numpy as np
import random
from networkx.readwrite import json_graph
import json

def generateGraph(size):
   graph = nx.cycle_graph(size)

   # Dodawanie krawędzi sąsiedzkich
   for index in range(size - 1):
      graph.add_edge(index, index + 1)
   
   # Definiowanie krawędzi przekątnych
   diagonals = [(source, source + 10) for source in [0, 2, 5, 7]]
   diagonals += [(source, (source + 5) % size) for source in [0, 12, 17, 2, 6, 5, 10, 15]]

   for (source, target) in diagonals:
      graph.add_edge(source, target)

   nx.set_edge_attributes(graph, 0.0, 'a')

   return graph

def generateIntensityMatrix(size):
   # Generowanie najkrótszych ścieżek
   N = np.zeros((size, size), dtype=int)
   for i in range(size):
      for j in range(size):
         if i != j:
            N[i][j] += random.randrange(30, 50)
   return N

def main():
   graphSize = 20

   G = generateGraph(graphSize)
   N = generateIntensityMatrix(graphSize)

   networkData = {
      "graph": json_graph.node_link_data(G), 
      "intensityMatrix": N.tolist()
   }
   
   with open('networkData', 'w') as graphFile:
      json.dump(networkData, graphFile, indent=2)

main()