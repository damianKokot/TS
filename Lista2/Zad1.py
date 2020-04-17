import networkx as nx
import numpy as np
import random

graphSize = 20
G = nx.cycle_graph(graphSize)

# Dodawanie krawędzi sąsiedzkich
for index in range(graphSize - 1):
   G.add_edge(index, index + 1)
# Dodawanie krawędzi przekątnych
diagonals = [(source, source + 10) for source in [0, 2, 5, 7]]
diagonals += [(source, (source + 5) % graphSize) for source in [0, 12, 17, 2, 6, 5, 10, 15]]

for (source, target) in diagonals:
   G.add_edge(source, target)
# Generowanie najkrótszych ścieżek
graphSize = G.number_of_nodes()
N = np.zeros((graphSize, graphSize))
for i in range(graphSize):
   for j in range(graphSize):
      if i != j:
         N[i][j] += random.randrange(30, 50)
#print(N)

def getSummaric(graph, N):
   graphSize = graph.number_of_nodes()
   NSumaric = np.zeros((graphSize, graphSize), dtype=int)
   fastEdges = {}

   for sourceIndex, sourceValues in enumerate(N):
      for targetIndex, weight in enumerate(sourceValues):
         nodeFrom = min(sourceIndex, targetIndex)
         nodeTo = max(sourceIndex, targetIndex)
         
         path = nx.shortest_path(graph, sourceIndex, targetIndex)
         for pathIndex in range(len(path) - 1):
            NSumaric[path[pathIndex]][path[pathIndex + 1]] += weight

         if N[nodeFrom][nodeTo] >= 8 / 9 * max(map(max, N)):
            fastEdges[(nodeFrom, nodeTo)] = N[nodeFrom][nodeTo]
   return NSumaric, fastEdges

NSumaric, fastEdges = getSummaric(G, N)

#print(len(fastEdges))
#print(NSumaric)

def c(edge):
   if edge in fastEdges.keys():
      return 3 * 10**8
   else:
      return 1 * 10**8

def a(edge, NSumaric):
   nodeFrom = min(edge)
   nodeTo = max(edge)
   
   return int(c(edge) / NSumaric[nodeFrom][nodeTo]) if NSumaric[nodeFrom][nodeTo] else 0

def averageWaitTime(G, N, averageSize):
   if not nx.is_connected(G):
      return -1
   sumOfIntensity = sum(sum(N))
   NSumaric, _ = getSummaric(G, N)
   return sum([averageSize / a(e, NSumaric) for e in G.edges]) / sumOfIntensity

# print(averageWaitTime(G, 10 ** 9))

def getRandom(edgeIndex):
   rangeOfRandom = 1000
   return (random.random() * edgeIndex ** 2) % rangeOfRandom / rangeOfRandom

def testRandom(p):
   passed = 0
   for probe in range(1000000):
      if getRandom(probe) > p:
         passed += 1
   return passed / 1000000

def reliability(graph, N, Tmax, p, packetSize=10**4, attempts=100):
   passedAttempts = 0
   delaysTotal = averageWaitTime(graph, N, packetSize)
   inConnectedCases = 0

   for _ in range(attempts):
      G = nx.Graph(graph)

      # Remove edges
      for edgeIndex, edge in enumerate(G.edges):
         if getRandom(edgeIndex) > p:
            G.remove_edge(*edge)
         if not nx.is_connected(G):
            break

      # Check if delay in each edge is higher or smaller than current
      waitTime = averageWaitTime(G, N, packetSize)
      if nx.is_connected(G) and waitTime < Tmax:
         passedAttempts += 1
         delaysTotal += waitTime
      elif not nx.is_connected(G):
         inConnectedCases += 1

   delaysAvg = delaysTotal / passedAttempts if passedAttempts else delaysTotal
   inConnectedCases = inConnectedCases / (attempts - passedAttempts) * 100 if passedAttempts != attempts else 0
   return passedAttempts / attempts * 100, delaysAvg, inConnectedCases

reliabileOn, delayAvg, inconnected = reliability(G, N, 0.000135, 0.3)
print('Reliability: {:.2f}% and average time passed: {:.6f}'.format(reliabileOn, delayAvg))
print('where in {:.2f}% cases there was inconnectCases'.format(inconnected))

#print(testRandom(0.9))