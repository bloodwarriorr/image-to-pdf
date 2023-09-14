import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import './ImageToPDFConverter.css'; 
function ImageToPDFConverter() {
  const [imageFiles, setImageFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFiles([...imageFiles, ...acceptedFiles]);
    }
  };

  const convertToPDF = async () => {
    if (!imageFiles.length>0) {
        alert('Please upload at least one image.');
        return;
      }
  
      const pdfDoc = await PDFDocument.create();
      for (const imageFile of imageFiles) {
      const imageBytes = await fetch(URL.createObjectURL(imageFile)).then((res) =>
        res.arrayBuffer()
      );
      const image = await pdfDoc.embedPng(imageBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      const { width, height } = page.getSize();
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }
      const userConfirmed = window.confirm(
          'Do you want to proceed and download the PDF?'
          );
          //   const url = URL.createObjectURL(blob);
          //   window.open(url);
          if (userConfirmed) {
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          saveAs(blob, 'myImage.pdf');
      }
      setImageFiles([]);
      
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept all image types
    multiple: true, // Allow only one file at a time
  });

  return (
    <div className="container">
      <h2>Image to PDF Converter</h2>
      <div  {...getRootProps()} style={{ cursor: 'pointer' }} className="drop-zone">
        <input {...getInputProps()} />
        {imageFiles ? (
          <p style={{wordBreak:'break-word'}}><b>Selected:</b><br></br><br></br> {imageFiles.map((img,index)=><span>{index+1+') '}{img.name}<br></br><br></br></span>)}</p>
        ) : (
          <p>Drag 'n' drop an image file here, or click to select one</p>
        )}
      </div>
      <div className="buttonSection">
      <button className='button' onClick={convertToPDF}>Convert to PDF</button>
      <button className='button' onClick={()=>setImageFiles([])}>Clear Select</button>
      </div>
    </div>
  );
}

export default ImageToPDFConverter;
