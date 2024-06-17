"use client";

import {
    ChangeEventHandler,
    DragEvent,
    DragEventHandler,
    useRef,
    useState,
} from "react";
import Image from "next/image";
import { alpha, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

const StyledUploadWrapper = styled('div')(({ theme }) => ({
    position: "relative",
    padding: "20px",
    width: "100%",
    height: "100%",
    minHeight: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    border: `1px dashed ${theme.palette.grey[500]}`,
    borderRadius: 4,
    transition: "color .15s, background .15s",
    cursor: "pointer",

    "&.is-hover": {
        borderColor: theme.palette.secondary.dark,
        background: alpha(theme.palette.secondary.dark, 0.1),
    },

    input: {
        display: "none",
    },
}));

export default function UploadImage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHover, setIsHover] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const stopDefault = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleFile = (_file: File | null = null) => {
        setError('');
        setFile(_file);

        if (!_file) {
            setPreviewImage('');
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function () {
            if (typeof this.result === 'string') setPreviewImage(this.result);
        };
        fileReader.readAsDataURL(_file);
    };

    const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
        stopDefault(e);
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
        handleFile(e.target.files?.[0]);

    return (
        <StyledUploadWrapper
            className={isHover ? "is-hover" : ""}
            onClick={() => inputRef.current?.click()}
            onDragEnter={() => setIsHover(true)}
            onDragLeave={() => setIsHover(false)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onDragOver={(e) => stopDefault(e)}
            onDrop={handleDrop}
        >
            {
                file
                    ? <Image src={previewImage} alt="upload image" objectFit="cover" fill />
                    : (
                        <>
                            <Image src="/cloud-upload.svg" alt="upload image" width={59} height={59} />
                            <Typography my={1}>專案圖片上傳</Typography>
                            <Typography mb={1}>點擊 or 將檔案拖曳至此</Typography>
                            <Typography variant="body2" color="grey.500">圖片格式：jpg、png、jpeg</Typography>
                            <Typography variant="body2" color="grey.500">圖片尺寸：1125 × 660 px</Typography>
                            <Typography variant="body2" color="grey.500">檔案大小：小於 5 Mb</Typography>
                            <FormHelperText error={!!error}>{error}</FormHelperText>
                        </>
                    )

            }
            <input type="file" ref={inputRef} accept=".jpg, .png, .jpeg" onChange={handleChange} />
        </StyledUploadWrapper>
    )
}