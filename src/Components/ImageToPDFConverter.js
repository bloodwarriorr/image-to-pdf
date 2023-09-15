import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import './ImageToPDFConverter.css';
import Modal from 'react-modal';
Modal.setAppElement('#root');
function ImageToPDFConverter() {
  const [imageFiles, setImageFiles] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);



  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const containsFilesThatAreNotPngOrJpg=acceptedFiles.filter((file)=>file.type==='image/png'||
      file.type==='image/jpeg'||file.type==='image/jpg')
      setImageFiles([...imageFiles, ...containsFilesThatAreNotPngOrJpg]);
    }
  };

  const handleConvertClick = () => {
    if (!imageFiles.length > 0) {
      alert('Please upload at least one image.');
      return;
    }

    // Open the confirmation modal
    setIsConfirmationModalOpen(true);
  };
  const deleteImage = (e, imageNameToDelete) => {
    e.stopPropagation();
    let tempArr = [];
    tempArr = imageFiles.filter((file) => file.name !== imageNameToDelete)
    setImageFiles(tempArr);
  }
  const handleCancel = (order) => {
    // Close the confirmation modal
    if (order === 'CancelAndRemainInput') {

      setIsConfirmationModalOpen(false);
    }
    else if (order === "CancelAndDeleteInput") {
      setIsConfirmationModalOpen(false);
      setImageFiles([]);
    }
  }
  const convertToPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    for (const imageFile of imageFiles) {
      const imageBytes = await fetch(URL.createObjectURL(imageFile)).then((res) =>
        res.arrayBuffer()
      );

      let image;
      switch (imageFile.type) {
        case "image/png":
          image = await pdfDoc.embedPng(imageBytes);
          break;
        case "image/jpeg":
          image = await pdfDoc.embedJpg(imageBytes);
          break;
        case "image/jpg":
          image = await pdfDoc.embedJpg(imageBytes);
          break;
      }
      const page = pdfDoc.addPage([image.width, image.height]);
      const { width, height } = page.getSize();
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
      //   const url = URL.createObjectURL(blob);
      //   window.open(url);

      
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'myImage.pdf');
  
    setImageFiles([]);
    setIsConfirmationModalOpen(false);
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept all image types
    multiple: true, // Allow only one file at a time
  });

  return (
    <div className="container">
      <h2>Image to PDF Converter</h2>
      <div  {...getRootProps()} style={{ cursor: 'pointer' }} className="drop-zone">
        <input  {...getInputProps()} />
        {imageFiles ? (
          <p className="scrollable-input" style={{ wordBreak: 'break-word' }}>
            <b>Selected:</b><br></br><br></br>
            {imageFiles.map((img, index) => <span key={index}><small className='small-delete-button' onClick={(e) => deleteImage(e, img.name)}>X </small>
              {index + 1 + ') '}{img.name}<br></br><br></br></span>)}</p>
        ) : (
          <p>Drag 'n' drop an image file here, or click to select one</p>
        )}
      </div>
      <div className="buttonSection">
        <button className="button" onClick={handleConvertClick}>
          Convert to PDF
        </button>
        <button className="button" onClick={() => handleCancel("CancelAndDeleteInput")}>
          Cancel
        </button>
      </div>
      <Modal
        isOpen={isConfirmationModalOpen}
        onRequestClose={handleCancel}
        contentLabel="Confirmation Modal"
        className="confirmation-modal"
        overlayClassName="confirmation-modal-overlay"
      >
        <div className="buttonSectionConfirmationDiv">
          <p>Do you want to proceed and download the PDF?</p>
          <div className="buttonSectionConfirmationBtns">
            <button className="button" onClick={convertToPDF}>Yes</button>
            <button className="button" onClick={() => handleCancel("CancelAndRemainInput")}>No</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ImageToPDFConverter;
