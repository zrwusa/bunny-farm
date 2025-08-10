import {EditorContent, JSONContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Heading} from '@tiptap/extension-heading';
import {Link} from '@tiptap/extension-link';
import {Image} from '@tiptap/extension-image';
import {CodeBlock} from '@tiptap/extension-code-block';
import {TextAlign} from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {Button} from '@/components/ui/button';
import './rich-text-editor.css';

interface RichTextRendererProps {
    content: JSONContent
    editable?: boolean
}

export const RichTextEditor = ({
                                   content,
                                   editable = false,
                               }: RichTextRendererProps) => {
    const editor = useEditor({
        extensions: [
            // disable heading & codeBlock in StarterKit
            StarterKit.configure({
                heading: false,
                codeBlock: false,
            }),

            // then re‑add only once each
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
            CodeBlock,

            // the rest
            Link,
            Image,
            TextAlign.configure({ types: ['paragraph', 'heading'] }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content,
        editable,
        immediatelyRender: false,
    })
    const handleBold = () => editor?.chain().focus().toggleBold().run();
    const handleItalic = () => editor?.chain().focus().toggleItalic().run();
    const handleStrike = () => editor?.chain().focus().toggleStrike().run();
    const handleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => editor?.chain().focus().toggleHeading({level}).run();
    const handleList = () => editor?.chain().focus().toggleBulletList().run();
    const handleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
    const handleLink = () => {
        const url = prompt('Enter URL');
        editor?.chain().focus().setLink({href: url ?? ''}).run();
    };
    const handleImage = () => {
        const url = prompt('Enter image URL');
        editor?.chain().focus().setImage({src: url ?? ''}).run();
    };
    const handleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
    const handleAlign = (alignment: string) => editor?.chain().focus().setTextAlign(alignment).run();
    const handleTable = () => editor?.chain().focus().insertTable({rows: 3, cols: 3, withHeaderRow: true}).run();
    const addRow = () => editor?.chain().focus().addRowAfter().run();
    const deleteRow = () => editor?.chain().focus().deleteRow().run();
    const addColumn = () => editor?.chain().focus().addColumnAfter().run();
    const deleteColumn = () => editor?.chain().focus().deleteColumn().run();
    const deleteTable = () => editor?.chain().focus().deleteTable().run();
    const saveContent = () => {
        const jsonContent = editor?.getJSON();
        console.log(JSON.stringify(jsonContent));
    };

    if (!editor) return <p className="text-gray-500">Loading content...</p>;

    return (
        <div>
            {editable
                ? <div className="toolbar">
                    <Button onClick={handleBold}>Bold</Button>
                    <Button onClick={handleItalic}>Italic</Button>
                    <Button onClick={handleStrike}>Strike</Button>
                    <Button onClick={() => handleHeading(1)}>H1</Button>
                    <Button onClick={() => handleHeading(2)}>H2</Button>
                    <Button onClick={() => handleHeading(3)}>H3</Button>
                    <Button onClick={handleList}>Bullet List</Button>
                    <Button onClick={handleOrderedList}>Ordered List</Button>
                    <Button onClick={handleLink}>Link</Button>
                    <Button onClick={handleImage}>Image</Button>
                    <Button onClick={handleCodeBlock}>Code Block</Button>
                    <Button onClick={() => handleAlign('left')}>Align Left</Button>
                    <Button onClick={() => handleAlign('center')}>Align Center</Button>
                    <Button onClick={() => handleAlign('right')}>Align Right</Button>
                    <div className="table">
                        <Button onClick={handleTable}>Insert Table</Button>
                        <Button onClick={addRow}>Add Row</Button>
                        <Button onClick={deleteRow}>Delete Row</Button>
                        <Button onClick={addColumn}>Add Column</Button>
                        <Button onClick={deleteColumn}>Delete Column</Button>
                        <Button onClick={deleteTable}>Delete Table</Button>
                    </div>
                </div>
                : null
            }
            <EditorContent editor={editor} className="prose max-w-full"/>
            {
                editable
                    ? <Button onClick={saveContent}>Save</Button>
                    : null
            }
        </div>
    );
}
