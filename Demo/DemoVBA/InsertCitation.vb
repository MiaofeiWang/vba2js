Sub InsertCitationBasedOnSearchedText()
    Dim textToFind As String
    Dim ccText As String
    Dim footnoteText As String

    textToFind = "Analytical Mining"
    ccText = "(Thompson, 1997)"
    footnoteText = "Thompson PA, Eaton WA, Hofrichter J: Laser temperature jump study of the helix<==coil kinetics of an alanine peptide interpreted with a 'kinetic zipper' model. Biochemistry. 1997;36(30):920010. 10.1021/bi9704764"

    Dim oRange As Word.Range
    Dim newRange As Word.Range
    Set oRange = ActiveDocument.Range

    With oRange.Find
        .Text = textToFind
        .ClearFormatting
        .MatchCase = False
        .MatchWholeWord = False
 
        Do While .Execute = True
            If .Found Then
                Set newRange = ActiveDocument.Range(oRange.End, oRange.End)
                'newRange.Start = oRange.End
                Set oCC = ActiveDocument.ContentControls.Add(wdContentControlRichText, newRange)
                oCC.Range.Text = ccText
                ActiveDocument.Footnotes.Add Range:=newRange, Text:=footnoteText
            End If

            oRange.Start = oRange.End
            oRange.End = ActiveDocument.Range.End
        Loop
    End With

End Sub