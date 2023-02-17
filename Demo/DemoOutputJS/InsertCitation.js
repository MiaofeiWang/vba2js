
async function InsertCitationBasedOnSearchedText() {
    await Word.run(async (context) => {
        var textToFind = "Analytical Mining";
        var ccText = "(Thompson, 1997)";
        var footnoteText = "Thompson PA, Eaton WA, Hofrichter J: Laser temperature jump study of the helix<==coil kinetics of an alanine peptide interpreted with a 'kinetic zipper' model. Biochemistry. 1997;36(30):920010. 10.1021/bi9704764";
        var oRange = context.document.body.getRange();
        var searchResults = oRange.search(textToFind, {
            matchCase: false,
            matchWholeWord: false
        });
        context.load(searchResults, 'items');
        await context.sync();
        for (var i = 0; i < searchResults.items.length; i++) {
            var newRange = searchResults.items[i].getRange();
            var oCC = newRange.insertContentControl();
            oCC.cells.body.insertText(ccText, 'Replace');
            newRange.insertFootnote(footnoteText);
        }
        await context.sync();
    });
}
