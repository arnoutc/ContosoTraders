import React, { Component, createRef } from "react";
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { ProductService } from '../../services';
import SearchIconNew from '../../assets/images/original/Contoso_Assets/product_page_assets/upload_icon.svg';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useLocation } from "react-router-dom";

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.dropzoneRef = createRef();
        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile(acceptedFiles) {
        const file = acceptedFiles[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            ProductService.getRelatedProducts(formData, this.props.userInfo.token)
                .then((relatedProducts) => {
                    if (relatedProducts.length > 1) {
                        this.props.history.push({
                            pathname: "/suggested-products-list",
                            state: { relatedProducts },
                        });
                    } else {
                        this.props.history.push({
                            pathname: `/product/detail/${relatedProducts[0].id}`,
                        });
                    }
                })
                .catch(() => {
                    this.props.enqueueSnackbar("There was an error uploading the image, please try again", {
                        variant: 'error',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        autoHideDuration: 6000,
                    });
                });
        }
    }

    renderDropzone() {
        // react-dropzone recommends using hooks, but here's a class-based wrapper using a function component
        const { title, subtitle } = this.props;

        const Dropzone = (props) => {
            const { getRootProps, getInputProps, isDragActive } = useDropzone({
                accept: { 'image/jpeg': [], 'image/png': [], 'image/bmp': [] },
                onDrop: this.uploadFile,
                multiple: false,
                maxFiles: 1,
            });

            return (
                <div {...getRootProps()} className="custom-dropzone" style={{
                    border: "2px dashed #ccc",
                    padding: "24px",
                    textAlign: "center",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}>
                    <input {...getInputProps()} />
                    <label className="upload__label" htmlFor="upload_image">
                        <img src={SearchIconNew} alt="upload" style={{ marginBottom: "16px" }} />
                        <span className="upload__info">
                            {subtitle ? <span className="upload__subtitle fs-14" style={{ color: 'black', fontSize: '14px' }}>{subtitle}</span> : null}
                            <span className="upload__title">{title}</span>
                        </span>
                    </label>
                    <div style={{ marginTop: "16px", color: "#888" }}>
                        {isDragActive
                            ? "Drop the files here..."
                            : "Drag 'n' drop an image here, or click to select one"}
                    </div>
                </div>
            );
        };

        return <Dropzone />;
    }

    render() {
        return (
            <form className="upload">
                {this.renderDropzone()}
            </form>
        );
    }
}

const mapStateToProps = state => state.login;

// Wrapper to inject navigate (and optionally location, params) as props
function UploadFileWrapper(props) {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();
    // ...you can add useParams if needed
    return <UploadFile {...props} navigate={navigate} location={location} enqueueSnackbar={enqueueSnackbar} />;
}

export default connect(mapStateToProps)(UploadFileWrapper);