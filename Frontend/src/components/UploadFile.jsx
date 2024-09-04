const UploadFile = ({ onFileChange }) => {
  const handleFileChange = (e) => {
    const files = e.target.files || e.dataTransfer.files;
    if (!files) return;

    onFileChange(files[0]); // Send the file to parent component
  };
  const handleClick = () => {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.click();
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files.length) return;
    handleFileChange(e);
  };

  return (
    <section className="upload-section">
      <div
        className="upload-file-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          onChange={handleFileChange}
          multiple={false}
          accept="audio/mp3,audio/mp4,audio/mpeg,audio/mpga,audio/m4a,audio/wav,video/mp4,video/webm"
          style={{ display: "none" }}
        />

        <div className="upload-box">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="upload-icon"
          >
            <path
              d="M14 6H16V8H21C21.5523 8 22 8.44772 22 9V16.5L16 13L16.0359 21.0622L18.2592 18.9129L20.041 22H9C8.44772 22 8 21.5523 8 21V16H6V14H8V9C8 8.44772 8.44772 8 9 8H14V6ZM22 17.338V21C22 21.107 21.9832 21.2101 21.9521 21.3068L19.9913 17.9129L22 17.338ZM4 14V16H2V14H4ZM4 10V12H2V10H4ZM4 6V8H2V6H4ZM4 2V4H2V2H4ZM8 2V4H6V2H8ZM12 2V4H10V2H12ZM16 2V4H14V2H16Z"
              fill="currentColor"
            ></path>
          </svg>
          <p className="upload-message">Click or drop a file here to start</p>
        </div>
      </div>
    </section>
  );
};

export default UploadFile;
