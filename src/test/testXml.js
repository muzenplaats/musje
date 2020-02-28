import test from '../test/test'
import Document, { XmlDecl, Doctype, Comment, Attrs, Element, el } from '../utils/XmlDocument'

test(Attrs, 'abc="efg" xyz="123"')
test(Comment, '<!-- abc \n  def -->')
test(Element, '<hello/>', '<hello world="yes" b="a"/>', '<hello></hello>',
              '<hello>world</hello>',
`<a b="c">
  <d g="e">f</d>
  <!-- comment -->
  <h>hello</h>
  <i/>
</a>
`)
test(XmlDecl, '<?xml version="1.0" encoding="ISO-8859-15"?>')
test(Doctype, '<!DOCTYPE note SYSTEM "Note.dtd">')
test(Document, `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC
    "-//Recordare//DTD MusicXML 3.0 Partwise//EN"
    "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.0">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>
`)
