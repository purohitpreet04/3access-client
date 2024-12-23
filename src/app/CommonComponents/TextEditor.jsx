import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/image.min.js';
import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from 'react-froala-wysiwyg';
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";


// import { Editor } from '@tinymce/tinymce-react';


const TextEditor = ({ onSave, value, isPreviwe }) => {
    const editorInstance = useRef(null);
    const [dynamicValues, setDynamicValues] = useState({});
    const editorRef = useRef(null);
    const [tempVal, setTempVal] = useState('')
    const [dragOver, setDragOver] = useState(false);
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/tinymce/tinymce.min.js"; // Path to TinyMCE in the public folder
        script.onload = () => {
            if (window.tinymce) {
                window.tinymce.init({
                    selector: "#editor",
                    plugins:
                        "print preview paste searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help emoticons",
                    toolbar:
                        "undo redo | bold italic underline strikethrough | fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media template link anchor codesample | ltr rtl",
                    height: 700,
                    branding: false, // Removes "Powered by TinyMCE" branding
                    setup: (editor) => {
                        // Save the editor instance to ref
                        editorRef.current = editor;

                        // Set initial value if provided
                        editor.on('init', () => {
                            if (value) {
                                editor.setContent(value);
                            }
                        });

                        editor.on('change', () => {
                            const content = editor.getContent();
                           
                            if (onSave) {
                                onSave(content);
                            }
                        });
                    },
                });
            }
        };
        document.body.appendChild(script);

        // Cleanup on component unmount
        return () => {
            if (window.tinymce) {
                window.tinymce.remove();
            }
            document.body.removeChild(script);
        };
    }, []);

    



    const logContent = () => {

        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    return (
        <div
            style={{
                border: dragOver ? "2px dashed #007bff" : "2px solid transparent",
                borderRadius: "5px",
                padding: "10px",
                position: "relative",
            }}
        >
            <textarea
                id="editor"
                value={value}
                style={{ width: "100%", height: "700px" }}
            ></textarea>
           
        </div>
    );

    const handleModelChange = (event) => {
        onSave(event)
    }

    let config = {
        heightMin: 300,
        fontFamily: {
            "Roboto": "Roboto", // Add your custom font here
            "Arial": "Arial, Helvetica, sans-serif",
            // "Times New Roman": "Times New Roman, serif",

        },
        tableEditing: true,
        table: {
            tableEditing: true, // Enable table editing
            tableStyles: [
                'width: 100%;', // Add full-width style to the table
                'text-align: center;',
                'border: 1px solid #ccc;',
                'border-collapse: collapse;',
                'height:700px'
            ],
            // Enable adding, editing, and deleting table rows/columns
            insertTableButtons: ['insertTable', 'insertRowAbove', 'insertRowBelow', 'insertColumnLeft', 'insertColumnRight'],
            deleteTableButtons: ['deleteTable', 'deleteRow', 'deleteColumn'],
            tableCellPadding: 5, // Padding for cells
        },
        // toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'color'],
        events: {
            contentChanged: function (e, editor) {
                console.log("test");
            }
        }
    };



    // return(
    //     <Editor/>
    // )

    // config={{
    //     heightMin: 300, // Minimum height
    //     heightMax: 500, // Maximum height
    //     placeholder: "Make Your Template here",
    //     fontSize: ['8', '10', '12', '14', '18', '24', '30', '36', '48'],
    //     // Enable all plugins
    //     pluginsEnabled: [
    //         'align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable',
    //         'emoticons', 'entities', 'file', 'fontAwesome', 'fontSize', 'fontFamily',
    //         'fullscreen', 'image', 'imageManager', 'inlineClass', 'inlineStyle', 'lineBreaker',
    //         'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert', 'quote',
    //         'save', 'table', 'tableTools', 'tableEdit', 'url', 'video', 'wordPaste', 'specialCharacters', 'embedly',
    //         'print', 'spellChecker', 'help'
    //     ],
    //     tableEditing: true,
    //     // Configure all toolbar buttons
    //     toolbarButtons: {
    //         moreText: {
    //             buttons: [
    //                 'bold', 'italic', 'underline', 'strikeThrough',
    //                 'subscript', 'superscript', 'fontFamily', 'fontSize',
    //                 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'
    //             ],
    //             align: 'left',
    //             buttonsVisible: 5,
    //         },
    //         moreParagraph: {
    //             buttons: [
    //                 'alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight',
    //                 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat',
    //                 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'
    //             ],
    //             align: 'left',
    //             buttonsVisible: 5,
    //         },
    //         moreRich: {
    //             buttons: [
    //                 'insertLink', 'insertImage', 'insertVideo', 'insertTable',
    //                 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly',
    //                 'insertFile', 'insertHR'
    //             ],
    //             align: 'left',
    //             buttonsVisible: 5,
    //         },
    //         moreMisc: {
    //             buttons: [
    //                 'undo', 'redo', 'fullscreen', 'print', 'getPDF',
    //                 'spellChecker', 'selectAll', 'html', 'help'
    //             ],
    //             align: 'right',
    //             buttonsVisible: 5,
    //         },
    //     },
    //     table: {
    //         tableEditing: true, // Enable table editing
    //         tableStyles: [
    //             'width: 100%;', // Add full-width style to the table
    //             'text-align: center;',
    //             'border: 1px solid #ccc;',
    //             'border-collapse: collapse;',
    //         ],
    //         // Enable adding, editing, and deleting table rows/columns
    //         insertTableButtons: ['insertTable', 'insertRowAbove', 'insertRowBelow', 'insertColumnLeft', 'insertColumnRight'],
    //         deleteTableButtons: ['deleteTable', 'deleteRow', 'deleteColumn'],
    //         tableCellPadding: 5, // Padding for cells
    //     },
    //     // Configure individual plugins
    //     imageUpload: true, // Enable image upload
    //     imageUploadURL: "/upload_image", // Backend endpoint for image uploads
    //     imageManager: {
    //         insertButtons: ['image', 'imageAlign', 'imageRemove'],
    //         responsive: true, // Make images responsive
    //     },
    //     videoUpload: true, // Enable video upload
    //     videoUploadURL: "/upload_video", // Backend endpoint for video uploads
    //     fileUpload: true, // Enable file upload
    //     fileUploadURL: "/upload_file", // Backend endpoint for file uploads
    //     charCounterCount: true, // Enable character counter
    //     spellcheck: true, // Enable spellchecker
    //     saveParam: 'content', // Set save parameter name
    //     saveURL: '/save_content', // Backend endpoint for saving content
    //     colorsText: [
    //         '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
    //     ], // Predefined text colors
    //     colorsBackground: [
    //         '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000'
    //     ], // Predefined background colors
    //     // Configure events
    //     events: {
    //         'image.inserted': function ($img) {
    //             console.log('Image inserted:', $img);
    //         },
    //         'image.error': function (error) {
    //             console.error('Image upload error:', error);
    //         },
    //         'video.inserted': function ($video) {
    //             console.log('Video inserted:', $video);
    //         },
    //         'video.error': function (error) {
    //             console.error('Video upload error:', error);
    //         },
    //         'file.error': function (error) {
    //             console.error('File upload error:', error);
    //         }
    //     },
    // }}

    // return (
    //     <div style={{ maxWidth: '100%', margin: '0 auto' }}>
    //         <FroalaEditorComponent
    //             onModelChange={handleModelChange}
    //             model={value}
    //             config={config}
    //             style={{
    //                 width: '100%', // Set full width
    //             }}
    //         />

    //         {isPreviwe && <FroalaEditorView
    //             model={value}
    //         />}
    //     </div>
    // );
};

export default TextEditor;
