# Grammar (raw)

score := WS (declaration | assignment)* expression? (declaration | assignment)*

declaration := include-decl | settting-decl | define-decl | maybe-more


include-decl ;= 'Include' WS ident WS ('from' WS ext-line)
ext-line := without-NL ('\' WS without-NL)*



component := cap-ident S ‘{‘ WS prop-list? (component WS | assignment | expression)*
prop-list := sm-ident ‘:’ SS without-NL (‘\’ without-NL)* WS
assignment := sm-ident ‘=‘ expression
expression := value (WS value)* WS  # tmp concatenation
value := paren | function | sm-ident | literal | component
paren := ‘(‘ expression ‘)’
function := sm-ident ‘(‘ WS expr-list ‘)’
expr-list := ‘’ | expression (‘,’ expression)* ‘)’
# literals as above


/*

// The convention is ComponentName (encouraged); CompName (discouraged) (both valid)
// because
// AVerySoMuchLongHistoryChangeLogSoLong {  # not too long but clear
//
// }
// CompName  # encrypted
// element-name (no comment; could lead to cumbersome; not readable; tl;dr in a line) or el-name (popular; element; why? often used; caught) (depends)
// CompName (less used; uncaught; CompanyName; not caught also but readable)
if (obj.userIsInTheMiddleOfEnteringADigit()) {  // readable
  b = obj.userIsInTheMiddleOfEnteringADigit() + a  // still good; x tl;dr

  c = obj.userIsInTheMiddleOfEnteringADigit() ||
      (blabar === afoofu ? 'abalblobfu' : '')  // tl;dr

  isEnteringDigit = obj.userIsInTheMiddleOfEnteringADigit()  // in the
  c = isEnteringDigit || (blabar === afoofu ? 'abalblobfu' : '')  // context

  c = obj.userIsEntering() ||  (blabar === afoofu ? 'abalblobfu' : '')
}


Set b = something  # memory


Define ComponentIdentifier from String {
  Catch content  # mutable but without state y no.

  Include a from 'p/t/a'
  Global b  # listening onReset(chhandler)/onClear(clhandler)
  Set c = 123  # Integer {  }         # Number { 123 } = 123
                                      # Double { 123 } = 123.0  Float {}
  Reset c = 456  # state changed
  Clear c

  # [c, setC] = useState(123)
  # setC(456)
  # delete c

  Something {
    b
    c
  }

  Define LexerError from Error {
    # ...
  }

  # The returned value is a component?
  Set value = JavaScript {
    // This is JS function without any changes.
    // The lang proccessor does two things:
    // One, automatic inject variable within the parent container scopes to here.
    // Another, the returned JS value will be converted to a defined component.
    // The component expression is an extension of JS. No need of ${}
    // so-called intepolation. The language processor will inject the JavaScript
    // variables to the component.
    import { parseCapIdent } from 'somewhere'
    let value
    try {
      value = parseCapIdent() // string
    } catch (lerr) {
      value = LexerError {
        # Code//skip
        Message {  }
      }
    }
    // Where is the cotext? A lambda
    return value  // primitive string in JS (**)
  // primitive string here
  }  # processor here => String { value } same as value literal; polyphomial?
  value  # value is String component; native/lib/3prt-lib? no worry
         # value is Error {...};        "
}

Reset b = someothers


Define AComp from PComp {

}

Set a = expr  # observable variable
Reset a = expr
Clear a

# Deprecated
Global a  # is not good!



Define

Include {
  ComponentIdentifier { TheCompName }
  Path {}
}
Include TheCompName from 'path/to/TheCompName'
Include TheCompName from namespace.subns.subsubns.sssns.ssss.TheCompName
Include TheCompName from


/*


Define CompnentIdentifier from TrimmedString {
  Catch content

  JavaScript {
    const src = content

    class LexerError extends Error {
      return {
        message: this.message
      }
    }

    const parseCapIdent = src => {
      let message
      if (/\n/.test(src)) {
        message = 'Cannot have new line!'
      } else if (/^[A-Z][A-Za-z]*$/.test(src)) {
        value = src
      } else {
        message = 'Unknown error!'
      }
      if {message)
        throw new LexerError({ message })
      }
      return value
    }

    try {
      value = parseCapIdent(src)
    } catch (lerr) {
      value = {
        return LexerError {
          Message { lerr.message }  # lerr injected
        }
      }
    }
  }
}
*/


/*

# Global a dropped

Set a = 1

Define AComp from PComp {
  Catch content
  Include b from 'path/to/b'
  Observe a
}

# The notion is LISP/Scheme with ASM

Define Define from ComplexType {
  Catch content
  Occur in ?
  ComponentIdentifier { AComp }
  ParentComponentIdentifier { PComp }
  CurlyBrace
}
//////

Usage:

Define {
  ComponentIdentifier { AComp }
  ParentComponent { PComp }
}
Define AComp as PComp
Define AComp from PComp {}  # content not caught; pass

Define {
  ComponentIdentifier { AComp }
  ParentComponent { PComp }
  Content { content }
}

# cudr /kudr/ + asm

# Pseudo
#      v cudr (unwrap)
Define ComponentIdentifier { AComp }
       from  # asm
             # as if no content
       ParentComponentIdentifier { PComp }
       Content { content }

Define AComp from PComp {
  Catch content

}

# pratice

Define Content {
  {
    ???
  }
}


Define {                        # !see not name/noun here but verb; data/control
  ComponentIdentifier { Catch }
  ParentComponentIdentifier { SimpleType }  # Type been abstracted
  Content
}

# Still usage of define but not define the define
Define {
  ComponentIdentifier { Catch }
  ParentComponentIdentifier { SimpleType }
  Content {
    Catch { content }
    JavaScript {special PCDATA Section; kw:embedded}
  }
}


Define Catch from SimpleType {
  Catch content
  JavaScript {
    if (content !== 'content') {
      return ValidationError(...)
    }
    return 'content'
  }
}


Define {
  ComponentIdentifier { Catch }
  ParentComponentIdentifier { SimpleType }
}

Define Catch from SimpleType {}
Define Catch as SimpleType  # not sloppy but room for later refactoring
                            # E.g., Catch property a

Define Use from SimpleType {
  Catch content
  JavaScript {...}
}
Use { SimpleType }
Use SimpleType
Define SimpleType as SimpleType
Define String as SimpleType
Define String from SimpleType {...}
Define TrimmedString from String {...}
Define Keyword from TrimmedString {...}
Define Catch from Keyword {...}

Catch { content }  # cudr-like
Catch content

Define Reset from ComplextType {
  Catch content
}

Reset {
  Identifier { a }
  Expression { 2 }
}
Reset a = 2
Reset a = a + 1
a = a + 1  # or unset error
a += 1
a++
++a


*/

The way of thinking is affected by LISP/Scheme and ASM
-----------------------------------------------------------------------------



Define CompnentIdentifier from TrimmedString {
  Catch content

  JavaScript {
    import { parseCapIdent } from 'somewhere'
    const src = content

    try {
      value = parseCapIdent(src)
    } catch (lerr) {
      value = {
        Message {
          lerr.message  # lerr injected
        }
      }
    }

    return value
  }
}


Define Path from SimpleType {

}





Define Include from ComplextType {

}



Usage:

Include {
  ComponetIdentifier { TheCompIdent }
  Path { to/the/path }
}



------------------------------------------------------------------------------


Usage:

Transmmision standard:

MusicDataList {
  Attributes {  # note that attributes here is component but not attr
                # 'cause attr is simtype by definition.
                # some people put attr position as prop in Component (successful)
                # This 'element' is defined in MusicXML.
    Time { 2/4 }
  }
  Note { 1 }
  Note { #2 }
  Note { c 1 }
  Note { c #2 }
  Rest { 0 }
}

Reshape for wanted modelling;

MusicDataList {
  Time { 2/4 }  # flatterned
  Note { 1 }
  Note { #2 }
  Chord { 1 #2 }  # aggregated
  Rest { 0 }
}

Porting:
# for some other language

MusicDataList {
  Time { 2/4 }
  Note { C }
  Note { Ds }
  Chord { C Ds }
  Rest { r }
}
//////


Define Property from Pair {
  Catch content
  JavaScript {
    name = ...
    value = ...

  }
}

Define Function from ComplextType {

}

Usage:

# Class wrapper
Define Car???????Class {
  Name { Car }
  Descriptor {...}
  Extend { Vehical }
  JavaScript {
    import Vehical from './Vehical'
    return new Car extends Vehical {
      // implement ...
    }
  }
}

# Class not supported.? Grammar conflict.


Define Function getName = Function {
  parameter { firstName: String }
  parameter { lastName: String }
}

AComp {
  Property {
    Name { smident }
    Value { 1 }
    }
  }
}

AComp {
  Property {
    Name { smident }
    Value {
      Function {
        # ...
      }
    }
  }
}

AComp {
  Property {
    smident: Function {
      # ...
    }
  }
}


AComp {
  Property {
    a: 1
  }
  Property {
    smident: function (args...) {
      # ...
    }
  }
  Property {
    smident2: function (args...) {
      # ...
    }
  }
}

# again cudr (flattern); asm (by tokens here); reduction

AComp {
  Properties {
    a: 1,
    smident(args...) {
      # ...
    },
    smident2(args...) {
      # ...
    }
  }
}

Define String from SimpleType {

}

Define Body from NodeList {...}
Define Test from NodeList {...}
Define Content from NodeList {...}
# vague; fail!

The function below can be transform to documentation precisely by Schema
and translation with given stylesheet.


Set getName = Function {
  Name { getName }
  Description { ... }

  Parameter {
    Name { firstName }
    Descriptor { the first nmae }
    Type { String }  # same as component name; they are all types
    DefaultValue { skipped }
  }
  Parameter {
    # ...
  }
  Return {
    Type {...}
    # ...
  }

  # X Inject; no. arranged. ?
  # alternative: TypeScript {}; ts things can be done by this lang processor. arr
  # ange. how? arranged and push down in JS {
  #   let firstName  // argument firstName
  #   let lastName   // argument lastName
  #   // callee         arguments
  # Parameters hold in complile time while arguments in run time.optional
  # }

  JavaScript {
    // for fresh; diff? it is not injection here!
    //
    return firstName + ' ' + lastName
  }
}


// behind the scence: keep best for the
// big medium small logics {[()]} for the better success
// curly brace (brace); bracket; parentheses (paren)
// unit: point/points (pt); Inch/inches ('); foot/feet (ft);
// human-scale; m/km/...trivial
//       pixel/pixels (px); voxel/voxels (vx); second/seconds (sec (s))
//       minute/minutes (min (m)); hour/hours (hr (h))
// remain 1s 1sec 1 sec 2 sec... ; add +/-1 second; 0 second; n seconds
// no notion of accuracy but high in precision.
// accuracy stays in time while precision stays in the duration (dur).
// There is the article in duration. Trainsient in the time; not in time.
// because C {...} succeed to catch eyes over (ask ...)


//////

Theory behind:

(atom atom list..)

(ask ...)  # LISP S-expression
ask (...)  # not S-expression anymore
~>
(node ask (...))  # yes, provide the tree-like Fortran math power in.
# hybrid LISP & Fortran families? engage? yes. and hybrid.

(atom atom list)
(define complextype from ct list)

Define ComplexType from no

Define Container from ComplexType {...}
Define List from Container {...}

                  # v LISP/Scheme power remains

# 1st step: normalization

Define Node from ComplexType {
  # ...
}

CompName {}  # =>
Node {
  CompName {}
}

# 2nd step: list

Define List from Container {
  Catch content  # remind notion of Catch { content } degradation
                 # i.e., uniform; then, normalization wanted...by list/nodes
                 # array/items
  Occur in Node*  # notion behind: proceduralize in occurance while
                  # modeling in aggreation for the hybrid thinks
                  # move async logics outside.why? it has state.
                  # it has lifetime; promise will be dead without your control?
  # ...

  # Robust but not cumbersome
  Method {
    Name { at }
    Value { Function {...} }
  }
  # toArray
  # fromArray
  # ...

}

Define Content from List  # clear




# Another fold: array

Define Array from Container {
  Catch content
  Occur AnyComponent*

  Property {
    Name { index}
  }
}

///////////////////////

(q? object or component)
component

Define Name from String {...}

Define Person from ComplexType {
  catch content

  Property {
    Name { firstName }
    Value { Tom }
  }
  Property {
    Name { lastName }
    Value { Smith }
  }
  Property {
    Name { age }
    Value { 25 }
  }
  Property {
    Get
  }

}

# Change spec!
Define String from SimpleType {
  # Trimmed!
}

# Full String? from SimpleType!






Define Occur

Occur {
  String { in }
  # ?...
}









Define Concate from ComplexType {
  Catch content
  Occur in String{2}
  JavaScript {
    return content.String[0] + content.String[1]
  }
}

Concat {
  String { abc }
  String { def }
}

# language build-in string literal
Concat {
  'abc'
  'def'
}
Concat { 'abc' 'def' }
# langumage build-in concat
'abc' 'def'

String { abc } String { def }  # =>
'abc' 'def'  # =>
'abcdef'  # =>
String { abcdef }



Set p = Persion {
  Define FirstName as String
  Define LastName as String

  FirstName { Tom }
  LastName { Smith }
  Age { 25 }

  Observe content

  FullName {
    Get {  content.FirstName[0] ' ' content.LastName[0] }
    Set {}
  }
}

Print 'Frist name: ' p.FirstName[0]  # First name: Tom  # concat
Print p.LastName[0]  # Smith
Print p.Name[0]

Print type of p.FirstName  # NoteList
print type of p.FirstName[0]  # String







==============================================================================

Use Tokens from './definitions/Tokens'
Use Comment from './definitions/Comment'
Use grammar from './definitions/Grammar'

Tokens {
  {: \{
  }: \}
  =: =
  sm-ident: [a-z][a-zA-Z]*
  cap-ident: [A-Z][a-zA-Z]*
  All: .*
}

Comment {
  CapIdent {
    InnerCI {  # to be locked
        {}}
    }  # <- locked by indentation
  }
}

Grammar {
  Document := WS What Component What WS

  What := Declaration | Expression

  Declaration := Include | Define | Set | Reset | Clear | Observe

  Include := 'Include' WS ...
  Define := 'Define' WS ...

  Set := 'Set' WS Assignment
  Reset := 'Reset' WS Assignment
  Clear := 'Clear' WS sm-ident
  Observe := 'Observe' WS sm-ident

  Assignment := sm-ident WS '=' Expression
  Expresion := (Component | Literals | ...)*  # ?...


  Component := cap-ident WS '{' Content '}'
  //                         ^open close ^lock (indentation lock)
  Content := SimpleContent | ComplexContent
  SimpleContent := brace-unlocked-section
  ComplexContent := WS


  SLComment := '#' All
  WS := (' ' | NL | SLComment)*
}

==============================================================================



