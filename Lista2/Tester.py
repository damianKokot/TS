import networkx as nx
from networkx.readwrite import json_graph
import numpy as np
import random
from copy import deepcopy
import json

edgeSpeed = 0

def loadGraphModel():
   with open('networkData', 'r') as networkFile:
      networkData = json.load(networkFile)
      graph = json_graph.node_link_graph(networkData['graph'])
      intensityMatrix = networkData['intensityMatrix']

      return graph, intensityMatrix

def main():
   graph, intensityMatrix = loadGraphModel()
   graph.graph['sumOfIntensities'] = sum(map(sum, intensityMatrix))

   attempts = 10000
   averageDataSize = 5000
   Tmax = 0.001
   edgeSpeed = 100000000
   propability = .95

   stats = testModel(graph, intensityMatrix, edgeSpeed, averageDataSize, Tmax, propability, attempts)
   print('Reliability: {:.2f}% and average time passed: {:.6f}'.format(stats['reliability'], stats['delay']))
   print('where in {:.2f}% cases there was connection timeout'.format(stats['timeouts']))

'''
Model testing functions
'''
def averageWaitTime(graph, m):
   totalTime = 0
   sumOfIntensity = graph.graph['sumOfIntensities']

   for edge in graph.edges:
      edgeData = graph.get_edge_data(*edge)
      totalTime += edgeData['a']/( edgeData['c']/m - edgeData['a'])

   return totalTime / sumOfIntensity

def testModel(graph, intensityMatrix, edgeSpeed, averageDataSize, Tmax, p, attempts):
   passedAttempts = 0
   delaysTotal = 0

   timeoutsCount = 0
   tooBigDataCount = 0

   for _ in range(attempts):
      updatedGraph = modifyMainGraphModel(graph, p)
      
      if not nx.is_connected(updatedGraph):
         continue

      nx.set_edge_attributes(updatedGraph, edgeSpeed, 'c')
      if not updateAOnPaths(updatedGraph, averageDataSize, intensityMatrix):
         tooBigDataCount += 1
         continue

      waitTime = averageWaitTime(updatedGraph, averageDataSize)
      
      if waitTime < Tmax:
         passedAttempts += 1
         delaysTotal += waitTime
      else:
         timeoutsCount += 1
   
   return {
      'reliability': getReliability(passedAttempts, attempts), 
      'timeouts': getTimeoutPercentage(timeoutsCount, attempts - passedAttempts),
      'delay': getAverageDelay(delaysTotal, passedAttempts)
   } 

'''
Statistics functions
'''
def getReliability(passedAttempts, attempts):
   return passedAttempts / attempts * 100

def getTimeoutPercentage(timeoutsCount, totalFailures):
   if totalFailures == 0:
      return 0
   return timeoutsCount / totalFailures * 100

def getAverageDelay(timeTotal, passedAttempts):
   if passedAttempts == 0:
      return 0
   return timeTotal / passedAttempts

'''
Graph modification functions
'''
def getRandom():
   return random.randrange(1000) / 1000

def filterRandomEdges(edgesList, p):
   return list(filter(lambda edge: getRandom() <= p, edgesList))

def modifyMainGraphModel(graph, p):
   newGraph = nx.Graph()
   newGraph.add_nodes_from(graph)
   newGraph.add_edges_from(filterRandomEdges(graph.edges, p))
   newGraph.graph = graph.graph
   
   return newGraph

'''
Updating edge attributes on path, to update weights on edges in graph 
'''
def updateAOnPaths(graph, averageDataSize, intensityMatrix):
   nx.set_edge_attributes(graph, 0.0, 'a')
   for source, row in enumerate(intensityMatrix):
      for target, weight in enumerate(row):
         if source == target:
            continue

         path = nx.shortest_path(graph, source, target)

         # Adding weight on path
         for nodeIndex in range(len(path) - 1):
            graph[path[nodeIndex]][path[nodeIndex + 1]]['a'] += weight

            edge = graph[path[nodeIndex]][path[nodeIndex + 1]]
            if edge['a'] * averageDataSize >= edge['c']:
               return False
   return True

main()
