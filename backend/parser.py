# import required modules
from bs4 import BeautifulSoup
 
# reading content
file = open("test.arxml", "r")
contents = file.read()
 
# parsing
soup = BeautifulSoup(contents, 'xml')

 
#display content
for child in soup.recursiveChildGenerator():
     name = getattr(child, "name", None)
     if name is not None:
         print(name)
     elif not child.isspace(): # leaf node, don't print spaces
         print(child)