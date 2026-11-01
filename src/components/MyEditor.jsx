import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import htmlEditButton from 'quill-html-edit-button';
if (typeof window !== 'undefined' && Quill && !Quill.imports['modules/htmlEditButton']) {
  Quill.register('modules/htmlEditButton', htmlEditButton);
}

const MyEditor = ({ value, onChange }) => {  
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // 🧼 Decode double-encoded HTML
  const decodeHTML = (html) => {    
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    const once = txt.value;
    txt.innerHTML = once;    
    return txt.value;
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
              [{ 'font': ['Open Sans', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'align': [] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              // ['blockquote', 'code-block'],
              ['link', 'image', 'video'],
              ['clean']
            ],
            // htmlEditButton: {
            //   debug: true,
            //   msg: "Edit the HTML below",
            //   okText: "Save",
            //   cancelText: "Cancel"
            // }
        },
      });

      // Initial value
      const decodedHTML = decodeHTML(value || '');
      quillRef.current.clipboard.dangerouslyPasteHTML(decodedHTML);
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;        
        if (onChange) onChange(html);
      });
    }
  }, []);

  // Update editor when `value` changes externally
  useEffect(() => {
    if (quillRef.current) {
      const decodedHTML = decodeHTML(value || '');
      if (quillRef.current.root.innerHTML !== decodedHTML) {
        quillRef.current.clipboard.dangerouslyPasteHTML(decodedHTML);
      }
    }    
  }, [value]);

  return (
    <div>
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
};

export default MyEditor;
