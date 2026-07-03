class TextWrapper{

    constructor(context){
        this.context = context;
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        // Split text into words
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.context.measureText(testLine);
            const testWidth = metrics.width;
            
            // If test line exceeds max width and it's not the first word, break the line
            if (testWidth > maxWidth && n > 0) {
            this.context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight; // Move y down for the next line
            } else {
            line = testLine;
            }
        }
        // Draw the remaining line
        this.context.fillText(line, x, y);
    }


}

export default TextWrapper;