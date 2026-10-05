const fs = require('fs');
const mdContent = fs.readFileSync('C:/Users/allen/.gemini/antigravity/brain/2415a0fb-b4b2-4572-8d97-e8c7892111d9/CineBook_Mini_Project_Report.md', 'utf8');

const html = `<!DOCTYPE html>
<html>
<head>
    <title>CineBook Mini Project Report</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 900px; margin: 0 auto; color: #333; }
        h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 40px; }
        h2 { color: #34495e; margin-top: 30px; }
        h3 { color: #555; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; }
        .mermaid { margin: 30px 0; display: flex; justify-content: center; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</head>
<body>
    <div id="content"></div>
    <script>
        const rawMd = \`${mdContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
        
        // Temporarily hide mermaid blocks
        let mermaidBlocks = [];
        let tempMd = rawMd.replace(/\`\`\`mermaid([\\s\\S]*?)\`\`\`/g, function(match, p1) {
            mermaidBlocks.push(p1);
            return 'MERMAID_BLOCK_' + (mermaidBlocks.length - 1);
        });
        
        let htmlContent = marked.parse(tempMd);
        
        mermaidBlocks.forEach((block, index) => {
            htmlContent = htmlContent.replace('<p>MERMAID_BLOCK_' + index + '</p>', '<div class="mermaid">' + block + '</div>');
            htmlContent = htmlContent.replace('MERMAID_BLOCK_' + index, '<div class="mermaid">' + block + '</div>');
        });
        
        document.getElementById('content').innerHTML = htmlContent;
    </script>
</body>
</html>`;

fs.writeFileSync('C:/vs code/CINEMA BOOKING WEBSITE/CineBook_Report.html', html, 'utf8');
