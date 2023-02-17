
async function ExtractCommentsToNewDoc() {
    await Word.run(async (context) => {
        var oDoc = context.document;
        var oNewDoc = context.application.createDocument();
        var oTable;
        var nCount = oDoc.body.getComments().items.length;
        var n;
        var Title = "Extract All Comments to New Document";
        
        if (nCount == 0) {
            console.log("The active document contains no comments.");
            return;
        }
        
        //Set to landscape
        oNewDoc.pageSetup.orientation = Word.Orientation.landscape;
        //Insert a 5-column table for the comments
        oTable = oNewDoc.body.insertTable(1, 5);
        oTable.autoFitWindow = false;
        oTable.width = 100;
        oTable.rows.getFirst().headingFormat = true;
        
        //Insert info in header - change date format as you wish
        oNewDoc.sections.getFirst().getHeader(Word.HeaderFooterType.primary).cells.body.insertText("Comments extracted from: " + "Ciatation Paper" + "\r\n" +
            "Created by: " + "Yun Wang" + "\r\n" +
            "Creation date: " + new Date().toLocaleDateString("en-US"), Word.InsertLocation.replace);
            
        //Adjust the Normal style and Header style
        oNewDoc.styles.getByName(Word.Style.normal).font.name = "Arial";
        oNewDoc.styles.getByName(Word.Style.normal).font.size = 10;
        oNewDoc.styles.getByName(Word.Style.normal).paragraphFormat.leftIndent = 0;
        oNewDoc.styles.getByName(Word.Style.normal).paragraphFormat.spaceAfter = 6;
        oNewDoc.styles.getByName(Word.Style.header).font.size = 8;
        oNewDoc.styles.getByName(Word.Style.header).paragraphFormat.spaceAfter = 0;
        
        //Insert table headings
        oTable.rows.getFirst().cells[0].body.insertText("Page", Word.InsertLocation.replace);
        oTable.rows.getFirst().cells[1].body.insertText("Comment state", Word.InsertLocation.replace);
        oTable.rows.getFirst().cells[2].body.insertText("Comment text", Word.InsertLocation.replace);
        oTable.rows.getFirst().cells[3].body.insertText("Author", Word.InsertLocation.replace);
        oTable.rows.getFirst().cells[4].body.insertText("Date", Word.InsertLocation.replace);
        
        //Get info from each comment from oDoc and insert in table
        for (n = 1; n <= nCount; n++) {
            oTable.rows.getFirst().cells[0].body.insertText(n, Word.InsertLocation.end);
            oTable.rows.getFirst().cells[1].body.insertText(oDoc.comments.items[n-1].done, Word.InsertLocation.end);
            oTable.rows.getFirst().cells[2].body.insertText(oDoc.comments.items[n-1].range.text, Word.InsertLocation.end);
            oTable.rows.getFirst().cells[3].body.insertText(oDoc.comments.items[n-1].author, Word.InsertLocation.end);
            oTable.rows.getFirst().cells[4].body.insertText(oDoc.comments.items[n-1].date.toLocaleDateString("en-US"), Word.InsertLocation.end);
        }
        
        oNewDoc.activate();
        console.log(nCount + " comments found. Finished creating comments document.");
        
        await context.sync();
    });
}
