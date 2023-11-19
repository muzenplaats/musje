# Blackboard

## Implementation 
(In language definition)
‘’’
Use SimpleType
Define ComplexType from SimpleType {
  Catch content  # a string
  JavaScript {
    // Parse the content
    // set content.nodeList
    return content  // a singleton 
  }
}

Define Component from ComplexType {
  Catch content 
 JavaScript {
    for (let node of content. nodeList) {
      if (!(node instanceof Property)) {
        break
      }
      const { name, value } = node
      content[name] = value
    }
    return content
  }
} 
‘’’

## Test usage ideas
‘’’
# (omitted)
Define AComp from Component {}
Define AComp as Component 
Use Component 
# (The above is built in.)
# (ThisIsAComponent {…}
# When mathematicians reach trivial
# about here.
# Scientists might reach that it readily…
# but cannot say that it simply… !!
# (Clear)

Confusion?
You can say that it is simply.
But when you say that it is simply something. You don’t describe it. Readily (it stays there).
Why singleton?
It is for the system defined.

Set jlname = ‘Smith’

AComp {
  Property { firstName: ‘John’ }
  Property { lastName: jlname }
}
‘’’