# musje v3

## Literals

```
n = #1’  // note literal
m = 1 2 3 4  // measure expression
m = 1 2 3 n  // 1 2 3 #1’
                      // variable substitution
b = |]  // bar literal
s = 1 2 | 3- |]  // staff expression
s = m 7 6 5 4  // 1 2 3 #1’ | 7 6 5 4
t = 2/4  // time-signature literal
s = 2/4 1 2 | 3- |
r = 0  // rest literal
c = <135>  // chord expression
mp = <<1 3 | 5->>  // multipart
                                   // expression
d1 = /allegro  // direction literal
d2 = \mf

dur = 1 quarter  // quantity literal
                             // number-unit pair
```

## Methods

n, m, s, p, s
n = #1’
n.tune(1 tone)  // #2’
n.tune(-4 semitones)  // 7
n.tuneUp(…)
n.tuneDown(…)
n.lengthen(2 times

Concatenation
mdl = n n  // #1’ #1’ yields a measure
                // not good!
                // yields MusicDataList
mdl2 = mdl mdl n
m = mdl |
ml = m m | 1 2 |  // MeasureList


n + 1  // error
n * 2  // error
// n(duration /= 2)  // 1 -> 1-
// n.pitch *= 2  // 1 -> 1’
s.duration *= 2
m2 = m  // clone
m2.duration *= 2


other-name := sm-ident
# sm-ident := [a-z][a-zA-Z\d]*
# cap-ident := [A-Z][a-zA-Z\d]*

include oldStar
staff3 = oldStar.body.part-1.staff-3

style = Style {
  font-size: 12pt
  font-family: Helvetica, Arial   \
                        Unicode, sans serif
  # ^ spaces ignored; included above
}
big = Style {
  font-size *= 1.3
}

# Substituting big in { big 1 }
# Note {
#   Style {
#     font-size *= 1.3
#   }
#   1
# }
# which is valid syntax in musje 3.
# Note in Note { big 1} was omitted.


If type of a is String, bl|expr
bl\expr if type of a is String.

String {
  CompName {

  }
}

Head {
  # Title is a string.
  Title {
}
 }
  }  c
b }
    To be trimmed...
    }
  } 
  # { } multi-line indentation lock
  # ${space(ident)}} SS
  Title { } } { }  # single-line lock
}

Define SimpleType from SimpleType {
  # ommited
}

Define SimpleType {
  Catch content
  content
}
# ommited
Define SimpleType {}
# ommited
Use SimpleType
Use ComplexType
# both ommited (predefined by musje)



Define String from SimpleType {
  Catch content
  Set value = JavaScript {
    content  // lambda
  }
  content  # same as been caught
}
# omitting...
Define String from SimpleType {
  Catch content
  content
}
# omitting...
Define String from SimpleType {
  content
}
Define String from SimpleType { content }
Define String from SimpleType {}
# (ommited)

Define String as SimpleType

# The reason to raise SimpleType is because they are equivalent in computer.
# The Number will be from SimpleType but not String!

Define Number from SimpleType {
  Catch content
  Set value = JavaScript {
    +content
  }
  content
}


Define Counter from PositiveInteger {
  Catch content  #
  Global a  # module scope
  Include b from path/to/file  # outside module
  # Only variables in this scope will be injected.
  Javascript {
    // For define-from clause; not class extends; correct
    this.value = new PositiveInteger(content)  // class
    value = PositiveInteger(content)  // function
    // Do Javascript component keep context?
    // Do Counter component keep context? Yes, needed.
    // Where?
    // The JavaScript component keeps this?

    // Function first; where to keep the context?
    value = Positiveinteger(context)
    return value
  }
}

Define Counter from Integer {
  Catch content  # content is the keyword for a component
                 # The root(tree) of Integer is SimpleType but not String.

}

Such as:

# String and Number are aligned and no quote is needed for a string.
# They gracefully degrade to literals.

Number { 123 }  # component? primitive.
123  # number literal; primitive? yes.
String { 123 }
'123'  # string literal

Boolean { true }  # primitive
true

Zero {}
Zero { 0 }
0  # literal
NaN {
  # Info or message pssible here
}
1/0
NaN { Message { Divide by zero! } }
NaN {}
NaN  # literal
1
One { 1 }
One {}

Set n = Fraction {
  Numerator { 1.23 }
  DeNumerator { 4.56 }
}
# no ambigueous 1.23/4.56 literal but possibly
$\frac{1.23}{4.56}$ or MathML by
n.toLatex()
n.toMathML()
n.value  # Number { 0.nnn }  # 0.nnn  # pretty strong category
# Literal could be possible as
f{1.23/4.56}  # don't know

Define Fraction from ComplexType {
  Catch content
  Occur in Numerator DeNumerator  # not sure how to do for complicated occrnc yet
  Set nom = content.Numerator[1]
  Set denom = content.deNumerator[1]
  Numerator { nom }
  DeNumerator { denom }
}

Define Rational from Fraction {
  Define IntegerNumerator as Integer  # Encapsulated (not reusable)
  Define IntegerDeNumerator as Integer

  Catch content
  Set nom = content.Numerator[1]
  Set denom = content.deNumerator[1]
  IntegerNumerator { nom }  # some not-integer error will be handled
  IntegerDeNumerator { denom }
}

Define Rational from SimpleType {
  Catch content
  JavaScript {
    import { parseRat } from 'somewhere'
    const rat = parseRat(content)
    return Rational {
      Numenator { rat.num }
      DeNumerator { rat.denom }
    }
  }
}

# The Complext type is the descendant of SimpleType. Not correct.
# By parsing the content of SimpleType, it can turn the value to the
# equivilant ComplexType as shown above (same).
# JavaScript supoorts automatic variable injection in the define scope,
# and the syntax of component expression.

Rational {
  Numenator { 1 }
  DeNumerator { 2 }
}

# The list has scope.
List {
  Set l = List { 1, 2, 3 }  # literal mixed for showing
  # A container component with an ordered sequence of components
  # The indices are implied by the order, in c.index or c.at(i)
  # []
  Set l2 = [4, 5, 6]  # gracefully degraded (not array, list, vector)
  # Another container component with unordered sequence fo components
  # {}
  Set d = { a: 1, b: 2 }  # literal (no notion of object, hash, dict by literal)

  # Everything is component.
  # When the component comes into the programming logics, it will be transformed
  # to the class form of the component; i.e., content to context, but not vice
  # versa.
  # The language will do limited programming as described here to associate the
  # possible context. As we know, those are often asycronize. The language here
  # Outside JavaScript {} or other ones is not really a glue but rather than a
  # maintainer of the components. Temperally, the main jobs for this language is
  # to do the so-called processing instruction (PI) session. The vission is to
  # enlarge the scope to do the PI session, PI session(s), PI sessions, and
  # a PI session reached in the given root component.
  # (tl;dr)
  # Yes, the traditional top-down thinking is from the top PI session.
  # Clear? Clear. Accord? Yes and preset. Anchor. Gathering. Map; Plan; route;path
  # However, here-in; it is bottom-up thinking; the bottom sessions are organized
  # from the bottom and hopefully be pulled up. Clear? Clear.
  # It won't be messy because the programming power are limited nicely on purpose
  # to have a graceful flow of data and logics. Because the logics are wrapped in
  # the component. The state of the component should be steady. One can analysis
  # the dataflow about the component(s).
  # An easy one could be any endpoint componet.
  # A NameStore {}; Nothing new but about a state; many states; PI session(s)
  # RootComponent owns the PI session; there-in, PI sessions; thus, PI session(s).
  # Top-down: the PI session (powerless?); Bottum-up: the PI sessions (messy?).
  # Not in this language.
  # (One important PI session in politics is called the procedure speaking.)
  # (To settle down the small but too strong power!)  # e.g., a lot of dataflow
  #                                                   # sharp; noisily heard
  #                                                   # but strong power
  #                                                   # noise or not?
  #                                                   # shown in the paticualre
  #                                                   # session; compromise solution
  # compormise is for shown of your cannot-show compliments.
  # They do not beg. You do not forget. Room for the let verb.
  # The let can be dangerous; let enemySomething  // not good; sloppy
  # var enemySomething  // unchanged; always variable
  # The below is a function container favored: (better)
  # this
  # const that = this  // complicated but not messy
  # function (a, b) {
  #   const argList = Array.from(arguments)  // turn arguments to a list
  #                                          // to be sorted (in/out easy add-in).
  #   this  // this !== that
  #   that.n
  #   let enemySomething  // good here
  # }
  # Avoid; do when you are sure of:
  # this
  # (a, b) => {
  #   this
  #   // only a and b arguments
  #   let enemySomething
  # }
  # Fin

  Item { 1 }
  Item { a }
  Item { l }
  Item {
    Dict {
      Pair {
        Key { free space }  # same as ""
        Value { something }
      }
      Pair { a: someOther }  # literal
      Pair { b: 'a string literal' }  # gracefully degraded
    }
  }
  Item {

  }
}

Define Container from ComplexType {
  Catch content
  Occur in Item*
  JavaScript {
    const
  }
}

Define List from Container {

}

Define Array from Container {

}

Define Vector from Container {

}

Define Dict from Container {

}


Rational { 1/2 }
r{1/2}  # possible rational literal

SimpleType / # #CDATA
             String / TrimmedString
             Number / Real / PositiveNumber  # for-fun logical derivation
                             NegativeNumber
                             Zero  # 0 is literal  # num / 0 = NaN
                             NaN
                             PositiveInfinity / Infinity  # alias oo=+oo
                             NegativeInfinity  # -oo  # oo is infinity literal
                             PositiveZero  # +0  # 1 / +0 = oo
                             NegativeZero  # -0  # 1 / -0 = -oo  +0 and -0 are  literals
                             NonNegativeNumber
                             NonPositiveNumber
                             Integer / PositiveInteger
                                       NegativeInteger
                                       NonNegativeInteger
                                       NonPositiveInteger
                           / Fraction / Rational
                           / Decimal / Double / Float
                      Complex  # about the same as Fraction for representation
            / ComplexType  # #PCDAT


Set n = Number { 123.456 }
Reset n = 123.456  # component literal; shorthand
Reset n = 1
Clear n
Set n = 2
# Set/Reset/Clear logic other then const or let/var

Define Error from ComplexType {
  Occur in Code Message? | Message? | Code  # child components
  Define Message as TrimmedString
  Define Code as Integer
}

Set err = Error {
  Code { -1 }  # child component; property com/sim
  Message { That is wrong! }
}

Define Function from Function {
  Catch content
  JavaScript
}

Set clickHandler = PureFunction {

}

Set compA = CompA {
  Properties {
    Code { -1 }  # ST
    Message { That is wrong! }  # ST
    Info { aJsonStr }  # CT? no; yes; function; cb? yes
    Click { clickHandler }
  }
  Content {

  }
}

String {
  a b c
  d e f
}
`
  a b c
  d e f
`
TrimmedString {
    x y z
  a b c
  d e f
    g h i
}
`
  x y z
a b c
d e f
  g h i
`

Set err = Error {
  Message { Something wrong! }
  Code { 501 }
}

# Set because
Set a = 1
Set a = 2  # Error; but a is not const so
Reset a = 2
# Further
Set a = 3  # refuse error again
# flexible; release it by
Clear a  # clear it for refreashed context
Reset a = 3 # wrong context!
Set a = 3

Catch content  # means
Set content  # as well


Define PositiveInteger from SimpleType {
  Catch content
  Set value = JavsScript {
    import
  }
}

# (Deprecated)
# Extend String from SimpleType
# Extend Number from SimpleType

Use SimpleType  # ommited

# Internal implementation in JavaScript for Use SimpleType
Define SimpleType from SimpleType {
  Catch content  # the content will be injected to JS
  Set a = 1  # so as to a
  Reset content = JavaScript {
    this.value = content  // content passed in the SimpleType object
    return this.value        // content converted into the context
                             // The class takes the same name as component.
                             // Or function? class// instance to hold the prop
                             // This is a constructor? No.
  }
  content
}


Define String as SimpleType
Define Number from SimpleType {
  Catch content  # notice that it is content but not context
  # The default script is not defined.
  # The JavaScript below is an implementation.
  JavaScript {
    // Where to store the value; by default in SimpleType?
    // Go to SimpleType ^

  } 
}

Define TrimmedString from String {
  Catch content # content caught
  Reset content = JavaScript {
    this.vaue = content.trim()  # just single-line as quick
                                # content passed into the context
                                # stored in the TrimmedString instance
                                # for possible later processes.
    Return this.value
  }
  content  # expression; lamda
}

# Reduce and improve
Define TrimmedString from String {
  Catch content
  JavaScript {
    import { mltrim } from 'path/to/helpers'
    this.vaue = mltrim(content)
    return this.value
  }
}


Define Number from SimpleType {
  Catch content
  JavaScript {
    this.value = +content
  }
}

Define Integer from SimpleType {
  Catch content
  JavaScript {
    import { parseInteger } from 'somewhere'
    this.value = parseInteger(content)
    const err = {}  // ...
    if (err) {
      return Error {
        Code { err.code }  # recursion happened as # or // implied
        Message { err.message }                    # same notion of JSX
      }
    }
    return this.value
  }
}

# The processor will know how to deal with this Error component.


Score {
  style  # substitution; not prop; a comp
  Head {
    title: 小星星
    composer: 法國童謠
  }
  Body {
    Part {
      Staff {
        2/4 1 { big 1 } | 5 { big 5 } | 6 6 | 5- |
      }
      Lyrics {
        一閃一閃 亮晶晶
      }
      Staff {
        1,_5,_ 3,_5,_ | 1,_5,_ 3,_5,_ |
        1,_6,_ 4,_6,_ | 1,_6,_ 4,_6,_ |
      }
      staff3
      Staff {
        test
      }
    }
  }
}



Set test = { big
  1,5, 3,5, | 1,5, 3,5, | 1,6, 4,6, | 1,6, 4,6,
  - -  - -    - -  - -    - -  - -    - -  - -
}

Set test = {}  # error

Reset test = { big
  1,5, 3,5, | 1,5, 3,5, | 1,6, 4,6, | 1,6, 4,6,
  - -  - -    - -  - -    - -  - -    - -  - -
}

# If the file is with

Staff {
  # …
}

# Only the staff will be rendered and others can include the staff for further processes. So is as to all other components; for example, the Style component, which is also cascaded.
# In the top level, there is only one expression!

Musje moves the expression down. No!

score := (assignment | declaration |  expression)*
declaration := include  # maybe more

Yes, only one expression on top and musje moves it to the bottom for rendering and/or to be included.

The scope of a variable is below the line of the assignment of the given component. The descendant components therein can see them. No worry because the values are immutable.

AnyCompName {
  s1 s2
  Style {}
}

Style(s) affects the later content only.
Same as <CompName style /> but can be cascaded.

For example, it can easily do embedding:

AnyCompName {
  a = 1
  a = JavaScript (a) {  // indent lock at a
    a += 1  // 2
    // }
    a
  }  // match indent at a
  # a = 2

  a = IPython {  # indent at a
    a += 1
    a
  }
  # a = 3
}

a is immutable in descending components but mutable in self component. Ancestor components cannot see descending variables. How to pass? As above.

For the implementation, the symtable is passed to JavaScript as ‘const a = 1’ automatically injected. Python: a = 1 automatically injected. Parsing needed to achieve this.

CompName {}
a = CompName {}
CompName a = CompName {}
CompName a = {}
CompName a {}


